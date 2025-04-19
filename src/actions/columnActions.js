import axios from "axios";
import { ADD_COLUMN, DELETE_COLUMN, GET_COLUMNS, GET_ERRORS } from "./types";

// Get all columns from the API
export const getColumns = () => async dispatch => {
  try {
    const res = await axios.get("http://localhost:8080/api/columns/all");
    dispatch({
      type: GET_COLUMNS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response?.data || {}
    });
  }
};

// Add a new column
export const addColumn = (column) => async dispatch => {
  try {
    const res = await axios.post("http://localhost:8080/api/columns", column);
    dispatch({
      type: ADD_COLUMN,
      payload: res.data
    });
    return true; // Return success
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response?.data || {}
    });
    return false; // Return failure
  }
};

// Delete a column and all its tasks
export const deleteColumn = (columnId) => async dispatch => {
  try {
    await axios.delete(`http://localhost:8080/api/columns/${columnId}`);
    dispatch({
      type: DELETE_COLUMN,
      payload: columnId
    });
    return true; // Return success
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response?.data || {}
    });
    return false; // Return failure
  }
};
