import { ADD_COLUMN, DELETE_COLUMN, GET_COLUMNS } from "../actions/types";

// Define default columns with isDefault flag
const initialState = {
  columns: [
    { id: "TO_DO", title: "TO DO", className: "bg-secondary", isDefault: true },
    { id: "IN_PROGRESS", title: "In Progress", className: "bg-primary", isDefault: true },
    { id: "DONE", title: "Done", className: "bg-success", isDefault: true }
  ]
};

export default function columnReducer(state = initialState, action) {
  switch (action.type) {
    case GET_COLUMNS:
      return {
        ...state
      };
    case ADD_COLUMN:
      // Add isDefault: false flag to user-added columns
      return {
        ...state,
        columns: [...state.columns, { ...action.payload, isDefault: false }]
      };
    case DELETE_COLUMN:
      // Only delete non-default columns
      return {
        ...state,
        columns: state.columns.filter(column =>
          column.id !== action.payload || column.isDefault
        )
      };
    default:
      return state;
  }
}
