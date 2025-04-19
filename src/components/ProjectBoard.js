import { closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteColumn, getColumns } from "../actions/columnActions";
import { addProjectTask, deleteProjectTask, getAllTasks } from "../actions/projectTaskActions";
import AddColumn from "./Column/AddColumn";

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
function DroppableContainer({ id, title, tasks, className, isDefault, onDeleteTask, onDeleteColumn }) {
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
        <div className={`card-header ${className} text-white`}>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">{title}</h3>
            {!isDefault && (
              <button
                className="btn btn-sm btn-light"
                onClick={() => onDeleteColumn(id)}
                title="Delete Column"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
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
  const { getAllTasks, addProjectTask, deleteProjectTask, deleteColumn, getColumns, tasksArray = [], columnsArray = [] } = props;
  const [activeTask, setActiveTask] = useState(null);
  // State for delete confirmation modal
  const [taskToDelete, setTaskToDelete] = useState(null);
  // State for add column modal
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  // State for column to delete confirmation
  const [columnToDelete, setColumnToDelete] = useState(null);

  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Fetch tasks and columns on mount
    getAllTasks();
    getColumns();
  }, [getAllTasks, getColumns]);

  // Generate columns with tasks
  const columns = columnsArray.map(column => ({
    ...column,
    tasks: tasksArray.filter(task => task.status === column.id)
  }));

  // If no columns are defined yet, use default columns
  if (columns.length === 0) {
    const todoTasks = tasksArray.filter(task => task.status === "TO_DO");
    const inProgressTasks = tasksArray.filter(task => task.status === "IN_PROGRESS");
    const doneTasks = tasksArray.filter(task => task.status === "DONE");

    columns.push(
      { id: "TO_DO", title: "TO DO", tasks: todoTasks, className: "bg-secondary", isDefault: true },
      { id: "IN_PROGRESS", title: "In Progress", tasks: inProgressTasks, className: "bg-primary", isDefault: true },
      { id: "DONE", title: "Done", tasks: doneTasks, className: "bg-success", isDefault: true }
    );
  }

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

  // Handle task deletion - show confirmation modal
  const handleDeleteTask = (taskId) => {
    // Find the task to delete
    const task = tasksArray.find(t => String(t.id) === String(taskId));
    if (task) {
      setTaskToDelete(task);
    }
  };

  // Handle column deletion - show confirmation modal
  const handleDeleteColumn = (columnId) => {
    // Find the column to delete
    const column = columnsArray.find(c => c.id === columnId);
    if (column && !column.isDefault) {
      setColumnToDelete(column);
    }
  };

  // Confirm task deletion
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteProjectTask(taskToDelete.id);
      setTaskToDelete(null); // Close the modal
    }
  };

  // Confirm column deletion
  const confirmDeleteColumn = () => {
    if (columnToDelete) {
      // Check if there are tasks in this column
      const tasksInColumn = tasksArray.filter(task => task.status === columnToDelete.id);

      // Delete all tasks in this column
      if (tasksInColumn.length > 0) {
        tasksInColumn.forEach(task => {
          deleteProjectTask(task.id);
        });
      }

      // Delete the column
      deleteColumn(columnToDelete.id);
      setColumnToDelete(null); // Close the modal
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setTaskToDelete(null);
    setColumnToDelete(null);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-3">
        <Link to="/addProjectTask" className="btn btn-primary">
          <i className="fas fa-plus-circle"> Create Project Task</i>
        </Link>
        <button className="btn btn-success" onClick={() => setShowAddColumnModal(true)}>
          <i className="fas fa-plus-circle"> Add Column</i>
        </button>
      </div>
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
                  isDefault={column.isDefault}
                  onDeleteTask={handleDeleteTask}
                  onDeleteColumn={handleDeleteColumn}
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

      {/* Delete Task Confirmation Modal */}
      {taskToDelete && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete Task</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task?</p>
                <div className="card mb-2">
                  <div className="card-header text-primary">ID: {taskToDelete.id}</div>
                  <div className="card-body">
                    <h5 className="card-title">{taskToDelete.summary}</h5>
                  </div>
                </div>
                <p className="text-danger"><strong>This action cannot be undone.</strong></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteTask}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Column Confirmation Modal */}
      {columnToDelete && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete Column</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this column?</p>
                <div className="card mb-2">
                  <div className={`card-header ${columnToDelete.className} text-white`}>
                    <h5 className="mb-0">{columnToDelete.title}</h5>
                  </div>
                </div>
                <p className="text-danger"><strong>Warning:</strong> All tasks in this column will also be deleted.</p>
                <p className="text-danger"><strong>This action cannot be undone.</strong></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={confirmDeleteColumn}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {showAddColumnModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Add New Column</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddColumnModal(false)}></button>
              </div>
              <div className="modal-body">
                <AddColumn onClose={() => setShowAddColumnModal(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ProjectBoard.propTypes = {
  getAllTasks: PropTypes.func.isRequired,
  addProjectTask: PropTypes.func.isRequired,
  deleteProjectTask: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  getColumns: PropTypes.func.isRequired,
  tasksArray: PropTypes.array.isRequired,
  columnsArray: PropTypes.array.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  tasksArray: state.projectTasks.projectTasks || [],
  columnsArray: state.columns.columns || []
});

export default connect(
  mapStateToProps,
  { getAllTasks, addProjectTask, deleteProjectTask, deleteColumn, getColumns }
)(ProjectBoard);
