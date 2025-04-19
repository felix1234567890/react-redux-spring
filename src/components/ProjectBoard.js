import { closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addProjectTask, deleteProjectTask, getAllTasks } from "../actions/projectTaskActions";

// Sortable task item component
function SortableTaskItem({ task, containerId, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.id}`,
    data: {
      task,
      containerId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle delete button click
  const handleDelete = (e) => {
    // Stop propagation to prevent drag events
    e.stopPropagation();
    // Call the delete function
    onDelete(task.id);
  };

  // Handle view/update button click
  const handleViewUpdate = (e) => {
    // Stop propagation to prevent drag events
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-task ${isDragging ? 'dragging' : ''}`}
      data-task-id={task.id}
      data-container-id={containerId}
    >
      <div className="card mb-1 bg-light">
        {/* Apply drag handlers only to the header and title areas */}
        <div className="card-header text-primary" {...attributes} {...listeners}>ID: {task.id}</div>
        <div className="card-body bg-light">
          <h5 className="card-title" {...attributes} {...listeners}>{task.summary}</h5>
          <p className="card-text text-truncate" {...attributes} {...listeners}>
            {task.acceptanceCriteria}
          </p>
          <div className="d-flex justify-content-between">
            <Link
              to={`/updateProjectTask/${task.id}`}
              className="btn btn-primary"
              onClick={handleViewUpdate}
            >
              View / Update
            </Link>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Droppable container component
function DroppableContainer({ id, title, tasks, className, onDeleteTask }) {
  // Create a sortable context for this container
  const { setNodeRef } = useSortable({
    id: id,
    data: {
      type: 'container',
      containerId: id
    }
  });

  return (
    <div className="col">
      <div className="card h-100">
        <div className={`card-header ${className} text-white text-center`}>
          <h3>{title}</h3>
        </div>
        <div
          ref={setNodeRef}
          className="card-body task-list"
          data-droppable-id={id}
        >
          <SortableContext
            id={id}
            items={tasks.map(task => `task-${task.id}`)}
          >
            {tasks.map((task) => (
              <SortableTaskItem
                key={`task-${task.id}`}
                task={task}
                containerId={id}
                onDelete={onDeleteTask}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}

function ProjectBoard(props) {
  // Destructure props to avoid dependency warnings
  const { getAllTasks, addProjectTask, deleteProjectTask, tasksArray = [] } = props;
  const [activeTask, setActiveTask] = useState(null);

  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Fetch tasks on mount
    getAllTasks();
  }, [getAllTasks]);

  // Derive task arrays directly from props
  const todoTasks = tasksArray.filter(task => task.status === "TO_DO");
  const inProgressTasks = tasksArray.filter(task => task.status === "IN_PROGRESS");
  const doneTasks = tasksArray.filter(task => task.status === "DONE");

  // Define columns
  const columns = [
    { id: "TO_DO", title: "TO DO", tasks: todoTasks, className: "bg-secondary" },
    { id: "IN_PROGRESS", title: "In Progress", tasks: inProgressTasks, className: "bg-primary" },
    { id: "DONE", title: "Done", tasks: doneTasks, className: "bg-success" }
  ];

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    const taskId = active.id.split('-')[1];
    const task = tasksArray.find(t => String(t.id) === taskId);
    setActiveTask(task);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    // Get data from the active and over elements
    const activeId = active.id;

    // Find the container ID from the over element
    let overContainerId;

    // Try to get the container ID from the over element's data
    if (over.data?.current?.containerId) {
      overContainerId = over.data.current.containerId;
    }
    // If over is a task, get its container
    else if (over.id.startsWith('task-')) {
      // Find the task's container from the columns data
      for (const column of columns) {
        if (column.tasks.some(task => `task-${task.id}` === over.id)) {
          overContainerId = column.id;
          break;
        }
      }
    }
    // If over is a container
    else {
      // Try to match the over.id with a column id
      const matchingColumn = columns.find(col => col.id === over.id);
      if (matchingColumn) {
        overContainerId = matchingColumn.id;
      }
    }

    // If we couldn't determine the target container, exit
    if (!overContainerId) {
      return;
    }

    // Get the task ID from the active.id
    const taskId = activeId.split('-')[1];
    const task = tasksArray.find(t => String(t.id) === taskId);

    if (!task) {
      return;
    }

    // If the task is already in this container, no need to update
    if (task.status === overContainerId) {
      return;
    }

    // Update the task status
    const updatedTask = {
      ...task,
      status: overContainerId
    };

    // Update the task in the database
    addProjectTask(updatedTask);

    // Update the UI immediately
    getAllTasks();
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    deleteProjectTask(taskId);
  };

  return (
    <div className="container">
      <Link to="/addProjectTask" className="btn btn-primary mb-3">
        <i className="fas fa-plus-circle"> Create Project Task</i>
      </Link>
      <br />
      <hr />

      {tasksArray.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No Project Tasks on this board
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="container">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {columns.map(column => (
                <DroppableContainer
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  tasks={column.tasks}
                  className={column.className}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="card mb-1 bg-light">
                <div className="card-header text-primary">ID: {activeTask.id}</div>
                <div className="card-body bg-light">
                  <h5 className="card-title">{activeTask.summary}</h5>
                  <p className="card-text text-truncate">
                    {activeTask.acceptanceCriteria}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" disabled>
                      View / Update
                    </button>
                    <button className="btn btn-danger" disabled>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

ProjectBoard.propTypes = {
  getAllTasks: PropTypes.func.isRequired,
  addProjectTask: PropTypes.func.isRequired,
  deleteProjectTask: PropTypes.func.isRequired,
  tasksArray: PropTypes.array.isRequired // Updated prop type
};

// Map only the necessary array from the Redux state
const mapStateToProps = state => ({
  tasksArray: state.projectTasks.projectTasks || []
});

export default connect(
  mapStateToProps,
  { getAllTasks, addProjectTask, deleteProjectTask }
)(ProjectBoard);
