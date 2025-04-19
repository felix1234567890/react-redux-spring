import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { addColumn } from "../../actions/columnActions";

function AddColumn({ addColumn, onClose, columns = [] }) {
  // Get all colors that are already used by existing columns
  const usedColors = columns.map(column => column.className);

  // Define all available colors
  const allColors = [
    { value: "bg-primary", label: "Blue" },
    { value: "bg-secondary", label: "Gray" },
    { value: "bg-success", label: "Green" },
    { value: "bg-danger", label: "Red" },
    { value: "bg-warning", label: "Yellow" },
    { value: "bg-info", label: "Light Blue" },
    { value: "bg-dark", label: "Dark" }
  ];

  // Filter out colors that are already used
  const availableColors = allColors.filter(color => !usedColors.includes(color.value));

  // Get the first available color or default to bg-info
  const defaultColor = availableColors.length > 0 ? availableColors[0].value : "bg-info";

  const [formData, setFormData] = useState({
    title: "",
    id: "",
    className: defaultColor
  });

  const onChange = (e) => {
    const { name, value } = e.target;

    // If updating the title, also update the ID with a sanitized version
    if (name === "title") {
      const id = value.toUpperCase().replace(/\s+/g, "_");
      setFormData({
        ...formData,
        title: value,
        id: id
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title.trim() || !formData.id.trim()) {
      return;
    }

    // Add the new column
    addColumn(formData);

    // Close the modal
    if (onClose) {
      onClose();
    }
  };

  // If no colors are available, add a message
  const noColorsAvailable = availableColors.length === 0;

  return (
    <div className="add-column-form">
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="title">Column Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Enter column title"
            required
          />
        </div>
        {/* Hidden input for ID */}
        <input
          type="hidden"
          id="id"
          name="id"
          value={formData.id}
        />
        <div className="form-group mb-3">
          <label htmlFor="className">Column Color</label>
          {noColorsAvailable ? (
            <div className="alert alert-warning">
              All colors are already in use. Please use a different set of columns.
            </div>
          ) : (
            <select
              className="form-control"
              id="className"
              name="className"
              value={formData.className}
              onChange={onChange}
            >
              {availableColors.map(color => (
                <option key={color.value} value={color.value}>{color.label}</option>
              ))}
            </select>
          )}
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={noColorsAvailable}>
            Add Column
          </button>
        </div>
      </form>
    </div>
  );
}

AddColumn.propTypes = {
  addColumn: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  columns: PropTypes.array
};

const mapStateToProps = state => ({
  columns: state.columns.columns || []
});

export default connect(mapStateToProps, { addColumn })(AddColumn);
