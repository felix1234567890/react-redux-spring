import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProjectTask } from "../../actions/projectTaskActions";

function ProjectTaskItem(props) {
  const onDeleteClick = (pt_id) => {
    props.deleteProjectTask(pt_id);
  };

  const { projectTask } = props;
  return (
    <div className="card mb-1 bg-light">
      <div className="card-header text-primary">ID: {projectTask.id}</div>
      <div className="card-body bg-light">
        <h5 className="card-title">{projectTask.summary}</h5>
        <p className="card-text text-truncate ">
          {projectTask.acceptanceCriteria}
        </p>
        <Link to={`/updateProjectTask/${projectTask.id}`} className="btn btn-primary">
          View / Update
        </Link>

        <button
          className="btn btn-danger ms-4"
          onClick={() => onDeleteClick(projectTask.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
ProjectTaskItem.propTypes = {
  deleteProjectTask: PropTypes.func.isRequired
};
export default connect(
  null,
  { deleteProjectTask }
)(ProjectTaskItem);
