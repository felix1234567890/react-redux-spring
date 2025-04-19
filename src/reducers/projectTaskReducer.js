// Import the new action type
import {
  DELETE_PROJECT_TASK,
  GET_PROJECT_TASK,
  GET_PROJECT_TASKS,
  UPDATE_PROJECT_TASK_SUCCESS
} from "../actions/types";

const initialState = {
  projectTasks: [],
  projectTask: {}
};
const projectTaskReducer = function(state = initialState, action) {
  switch (action.type) {
    case GET_PROJECT_TASKS:
      return {
        ...state,
        projectTasks: action.payload
      };
    case GET_PROJECT_TASK:
      return {
        ...state,
        projectTask: action.payload
      };
    case DELETE_PROJECT_TASK:
      return {
        ...state,
        projectTasks: state.projectTasks.filter(
          // Ensure comparison handles potential type differences (string vs number)
          projectTask => String(projectTask.id) !== String(action.payload)
        )
      };
    // Handle the update action
    case UPDATE_PROJECT_TASK_SUCCESS:
      return {
        ...state,
        projectTasks: state.projectTasks.map(projectTask =>
          // Ensure comparison handles potential type differences (string vs number)
          String(projectTask.id) === String(action.payload.id)
            ? action.payload // Replace with the updated task
            : projectTask // Keep the original task
        )
      };
    default:
      return state;
  }
};

export default projectTaskReducer;
