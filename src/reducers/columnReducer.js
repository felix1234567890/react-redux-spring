import { ADD_COLUMN, DELETE_COLUMN, GET_COLUMNS } from "../actions/types";

// Initial state with empty columns array
const initialState = {
  columns: []
};

export default function columnReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COLUMNS:
      return {
        ...state,
        columns: action.payload || []
      };
    case ADD_COLUMN:
      return {
        ...state,
        columns: [...state.columns, action.payload]
      };
    case DELETE_COLUMN:
      return {
        ...state,
        columns: state.columns.filter(column => column.id !== action.payload)
      };
    default:
      return state;
  }
}
