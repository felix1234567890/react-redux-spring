import axios from "axios";
import {
  DELETE_PROJECT_TASK,
  GET_ERRORS,
  GET_PROJECT_TASK,
  GET_PROJECT_TASKS,
  UPDATE_PROJECT_TASK_SUCCESS // Import the new action type
} from "./types";

export const addProjectTask = (projectTask, navigate) => async dispatch => {
  try {
    await axios.post("http://localhost:8080/api/board", projectTask);

    // Clear any errors
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });

    // Dispatch success action with the updated task data
    dispatch({
      type: UPDATE_PROJECT_TASK_SUCCESS,
      payload: projectTask // Pass the updated task object
    });

    // Navigate back to the board if navigate is provided
    if (navigate) {
      navigate("/");
    }
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response?.data || {}
    });
  }
};

export const getAllTasks = () => async dispatch => {
  try {
    const res = await axios.get("http://localhost:8080/api/board/all");
    dispatch({
      type: GET_PROJECT_TASKS,
      payload: res.data || []
    });
  } catch (error) {
    dispatch({
      type: GET_PROJECT_TASKS,
      payload: []
    });
  }
};

export const deleteProjectTask = pt_id => async dispatch => {
  try {
    await axios.delete(`http://localhost:8080/api/board/${pt_id}`);
    dispatch({
      type: DELETE_PROJECT_TASK,
      payload: pt_id
    });

    // Refresh the task list after deletion
    dispatch(getAllTasks());
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const getProjectTask = (pt_id, navigate) => async dispatch => {
  try {
    const res = await axios.get(`http://localhost:8080/api/board/${pt_id}`);
    dispatch({
      type: GET_PROJECT_TASK,
      payload: res.data || {}
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    navigate("/");
  }
};
