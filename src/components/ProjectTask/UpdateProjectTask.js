import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addProjectTask, getProjectTask } from "../../actions/projectTaskActions";

function UpdateProjectTask(props) {
  // Destructure props to avoid dependency warnings
  const { getProjectTask, addProjectTask, projectTask, errors: propsErrors } = props;
  const { pt_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    summary: "",
    acceptanceCriteria: "",
    status: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getProjectTask(pt_id, navigate);
  }, [pt_id, getProjectTask, navigate]);

  useEffect(() => {
    if (propsErrors) {
      setErrors(propsErrors);
    }

    if (projectTask) {
      const { id, summary, acceptanceCriteria, status } = projectTask;
      setFormData({
        id: id || "",
        summary: summary || "",
        acceptanceCriteria: acceptanceCriteria || "",
        status: status || ""
      });
    }
  }, [propsErrors, projectTask]);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const updatedTask = {
      id: formData.id,
      summary: formData.summary,
      acceptanceCriteria: formData.acceptanceCriteria,
      status: formData.status
    };
    addProjectTask(updatedTask, navigate);
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
              Update Project Task
            </h4>
            <form onSubmit={onSubmit}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.summary
                  })}
                  name="summary"
                  placeholder="Project Task summary"
                  value={formData.summary}
                  onChange={onChange}
                />
                {errors.summary && (
                  <div className="invalid-feedback">{errors.summary}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <textarea
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.acceptanceCriteria
                  })}
                  placeholder="Acceptance Criteria"
                  name="acceptanceCriteria"
                  value={formData.acceptanceCriteria}
                  onChange={onChange}
                />
              </div>
              <div className="form-group mb-3">
                <select
                  className={classnames("form-control form-control-lg", {
                    "is-invalid": errors.status
                  })}
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                >
                  <option value="">Select Status</option>
                  <option value="TO_DO">TO DO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
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
UpdateProjectTask.propTypes = {
  projectTask: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getProjectTask: PropTypes.func.isRequired,
  addProjectTask: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  projectTask: state.projectTasks.projectTask,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getProjectTask, addProjectTask }
)(UpdateProjectTask);
