import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { addColumn } from "../../actions/columnActions";

function AddColumn({ addColumn, onClose, columns = [], errors = {} }) {
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

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  const onSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setFormErrors({});

    // Validate form
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.id.trim()) {
      errors.id = "ID is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Set submitting state
    setIsSubmitting(true);

    try {
      // Add the new column
      const success = await addColumn(formData);

      // If successful, close the modal
      if (success && onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error adding column:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no colors are available, add a message
  const noColorsAvailable = availableColors.length === 0;

  // Check for API errors from Redux
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      // Map API errors to form errors
      const apiErrors = {};

      // Handle specific error messages
      if (errors.title) {
        apiErrors.title = errors.title;
      }

      if (Object.keys(apiErrors).length > 0) {
        setFormErrors(prevErrors => ({
          ...prevErrors,
          ...apiErrors
        }));
      }
    }
  }, [errors]);

  return (
    <div className="add-column-form">
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="title">Column Title</label>
          <input
            type="text"
            className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Enter column title"
          />
          {formErrors.title && (
            <div className="invalid-feedback">{formErrors.title}</div>
          )}
        </div>
        {/* Hidden input for ID */}
        <input
          type="hidden"
          id="id"
          name="id"
          value={formData.id}
        />
        {formErrors.id && (
          <div className="alert alert-danger">{formErrors.id}</div>
        )}
        <div className="form-group mb-3">
          <label htmlFor="className">Column Color</label>
          {noColorsAvailable ? (
            <div className="alert alert-warning">
              All colors are already in use. Please use a different set of columns.
            </div>
          ) : (
            <select
              className={`form-control ${formErrors.className ? 'is-invalid' : ''}`}
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
          {formErrors.className && (
            <div className="invalid-feedback">{formErrors.className}</div>
          )}
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={noColorsAvailable || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Column'}
          </button>
        </div>
      </form>
    </div>
  );
}

AddColumn.propTypes = {
  addColumn: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  columns: PropTypes.array,
  errors: PropTypes.object
};

const mapStateToProps = state => ({
  columns: state.columns.columns || [],
  errors: state.errors
});

export default connect(mapStateToProps, { addColumn })(AddColumn);
