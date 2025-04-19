import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addProjectTask, getAllTasks } from "../actions/projectTaskActions";

function ProjectBoard(props) {
  // Removed local state for task arrays. Will derive directly from props.

  useEffect(() => {
    // Fetch tasks on mount
    props.getAllTasks();
  }, [props.getAllTasks]); // Dependency array ensures this runs only once on mount

  // Removed useEffect that derived local state from props.

  const onDragEnd = result => {
    // Drag end handler
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped back in the same place
    if (!destination ||
        (destination.droppableId === source.droppableId &&
         destination.index === source.index)) {
      return;
    }

    // Get the task ID from the draggableId
    const taskId = parseInt(draggableId.split('-')[1]);

    // Find the task directly in the mapped props.tasksArray
    const tasksArray = props.tasksArray || []; // Use the mapped array
    const taskIdStr = String(taskId);
    const task = tasksArray.find(t => String(t.id) === taskIdStr);

    if (!task) {
      // Corrected error message to reference props.tasksArray
      // Task not found in array
      return;
    }

    // Update the task status
    const updatedTask = {
      ...task,
      status: destination.droppableId
    };

    // Update the task in the database
    // This action will dispatch UPDATE_PROJECT_TASK_SUCCESS
    // triggering the reducer and then the useEffect hook.
    props.addProjectTask(updatedTask);

    // Removed direct local state updates to rely on Redux as the single source of truth.
    // Removed direct local state updates to rely on Redux as the single source of truth.
  };

  // Derive task arrays directly from props within the render logic
  // Use the tasksArray prop directly (mapped from state.projectTasks.projectTasks)
  const tasksArray = props.tasksArray || [];
  const todoTasks = tasksArray.filter(task => task.status === "TO_DO");
  const inProgressTasks = tasksArray.filter(task => task.status === "IN_PROGRESS");
  const doneTasks = tasksArray.filter(task => task.status === "DONE"); // Corrected to use tasksArray

  // Derived arrays for rendering

  return (
    <div className="container">
      <Link to="/addProjectTask" className="btn btn-primary mb-3">
        <i className="fas fa-plus-circle"> Create Project Task</i>
      </Link>
      <br />
      <hr />

      {tasksArray.length === 0 ? ( // Check the mapped array
        <div className="alert alert-info text-center" role="alert">
          No Project Tasks on this board
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="card text-center mb-2">
                  <div className="card-header bg-secondary text-white">
                    <h3>TO DO</h3>
                  </div>
                </div>
                <Droppable droppableId="TO_DO" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {todoTasks.map((task, index) => (
                        <Draggable
                          key={`task-${task.id}`} // Ensure key and draggableId are identical strings
                          draggableId={`task-${task.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`draggable-task ${snapshot.isDragging ? 'dragging' : ''}`}
                            >
                              <div className="card mb-1 bg-light">
                                <div className="card-header text-primary">ID: {task.id}</div>
                                <div className="card-body bg-light">
                                  <h5 className="card-title">{task.summary}</h5>
                                  <p className="card-text text-truncate">
                                    {task.acceptanceCriteria}
                                  </p>
                                  <Link to={`/updateProjectTask/${task.id}`} className="btn btn-primary">
                                    View / Update
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              <div className="col-md-4">
                <div className="card text-center mb-2">
                  <div className="card-header bg-primary text-white">
                    <h3>In Progress</h3>
                  </div>
                </div>
                <Droppable droppableId="IN_PROGRESS" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {inProgressTasks.map((task, index) => (
                        <Draggable
                          key={`task-${task.id}`} // Ensure key and draggableId are identical strings
                          draggableId={`task-${task.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`draggable-task ${snapshot.isDragging ? 'dragging' : ''}`}
                            >
                              <div className="card mb-1 bg-light">
                                <div className="card-header text-primary">ID: {task.id}</div>
                                <div className="card-body bg-light">
                                  <h5 className="card-title">{task.summary}</h5>
                                  <p className="card-text text-truncate">
                                    {task.acceptanceCriteria}
                                  </p>
                                  <Link to={`/updateProjectTask/${task.id}`} className="btn btn-primary">
                                    View / Update
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              <div className="col-md-4">
                <div className="card text-center mb-2">
                  <div className="card-header bg-success text-white">
                    <h3>Done</h3>
                  </div>
                </div>
                <Droppable droppableId="DONE" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {doneTasks.map((task, index) => (
                        <Draggable
                          key={`task-${task.id}`} // Ensure key and draggableId are identical strings
                          draggableId={`task-${task.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`draggable-task ${snapshot.isDragging ? 'dragging' : ''}`}
                            >
                              <div className="card mb-1 bg-light">
                                <div className="card-header text-primary">ID: {task.id}</div>
                                <div className="card-body bg-light">
                                  <h5 className="card-title">{task.summary}</h5>
                                  <p className="card-text text-truncate">
                                    {task.acceptanceCriteria}
                                  </p>
                                  <Link to={`/updateProjectTask/${task.id}`} className="btn btn-primary">
                                    View / Update
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
ProjectBoard.propTypes = {
  getAllTasks: PropTypes.func.isRequired,
  addProjectTask: PropTypes.func.isRequired,
  tasksArray: PropTypes.array.isRequired // Updated prop type
};

// Map only the necessary array from the Redux state
const mapStateToProps = state => ({
  tasksArray: state.projectTasks.projectTasks || []
});

export default connect(
  mapStateToProps,
  { getAllTasks, addProjectTask }
)(ProjectBoard);
