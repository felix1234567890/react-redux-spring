import { combineReducers } from "redux";
import columnReducer from "./columnReducer";
import errorsReducer from "./errorsReducer";
import projectTaskReducer from "./projectTaskReducer";

export default combineReducers({
  errors: errorsReducer,
  projectTasks: projectTaskReducer,
  columns: columnReducer
});
