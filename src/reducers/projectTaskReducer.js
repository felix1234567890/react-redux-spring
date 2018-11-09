import {
  GET_PROJECT_TASKS,
  DELETE_PROJECT_TASK,
  GET_PROJECT_TASK
} from "../actions/types";

const initialState = {
  projectTasks: [],
  projectTask: {}
};
export default function(state = initialState, action) {
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
          projectTask => projectTask.id !== action.payload
        )
      };
    default:
      return state;
  }
}
