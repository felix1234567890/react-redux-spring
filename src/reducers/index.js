import { combineReducers } from "redux";
import errorsReducer from "./errorsReducer";
import projectTaskReducer from "./projectTaskReducer";

export default combineReducers({
  errors: errorsReducer,
  projectTasks: projectTaskReducer
});
