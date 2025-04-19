import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addProjectTask } from "../../actions/projectTaskActions";

function AddProjectTask(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    summary: "",
    acceptanceCriteria: "",
    status: "TO_DO" // Set default status to TO_DO
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (props.errors) {
      setErrors(props.errors);
    }
  }, [props.errors]);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newProjectTask = {
      summary: formData.summary,
      acceptanceCriteria: formData.acceptanceCriteria,
      status: formData.status
    };
    props.addProjectTask(newProjectTask, navigate);
  };

  return (
    <div className="addProjectTask">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <Link to="/" className="btn btn-light">
              Back to Board
            </Link>
            <h4 className="display-4 text-center">
              Add Project Task
            </h4>
            <form onSubmit={onSubmit}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.summary
                  })}
                  name="summary"
                  value={formData.summary}
                  placeholder="Project Task summary"
                  onChange={onChange}
                />
                {errors.summary && (
                  <div className="invalid-feedback">{errors.summary}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <textarea
                  className="form-control form-control-lg"
                  placeholder="Acceptance Criteria"
                  name="acceptanceCriteria"
                  value={formData.acceptanceCriteria}
                  onChange={onChange}
                />
              </div>
              {/* Hidden input for status - always set to TO_DO for new tasks */}
              <input type="hidden" name="status" value={formData.status} />
              <input
                type="submit"
                className="btn btn-primary w-100 mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
AddProjectTask.propTypes = {
  addProjectTask: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addProjectTask }
)(AddProjectTask);
