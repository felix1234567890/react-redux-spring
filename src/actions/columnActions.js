import { ADD_COLUMN, DELETE_COLUMN, GET_COLUMNS } from "./types";

// Get all columns
export const getColumns = () => dispatch => {
  dispatch({
    type: GET_COLUMNS
  });
};

// Add a new column
export const addColumn = (column) => dispatch => {
  dispatch({
    type: ADD_COLUMN,
    payload: column
  });
};

// Delete a column
export const deleteColumn = (columnId) => dispatch => {
  dispatch({
    type: DELETE_COLUMN,
    payload: columnId
  });
};
