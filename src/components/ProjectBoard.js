import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProjectTaskItem from "./ProjectTask/ProjectTaskItem";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAllTasks } from "../actions/projectTaskActions";

class ProjectBoard extends Component {
  componentDidMount() {
    this.props.getAllTasks();
  }
  render() {
    const { projectTasks } = this.props.projectTasks;
    let boardContent;
    let todoItems = [];
    let inProgressItems = [];
    let doneItems = [];
    const board = projectTasks => {
      if (projectTasks.length < 1) {
        return (
          <div classsname="alert alert-info text-center">No project tasks</div>
        );
      } else {
        const tasks = projectTasks.map(task => (
          <ProjectTaskItem key={task.id} project_task={task} />
        ));
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].props.project_task.status === "TO_DO") {
            todoItems.push(tasks[i]);
          }
          if (tasks[i].props.project_task.status === "IN_PROGRESS") {
            inProgressItems.push(tasks[i]);
          }
          if (tasks[i].props.project_task.status === "DONE") {
            doneItems.push(tasks[i]);
          }
        }
        return (
          <React.Fragment>
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <div className="card text-center mb-2">
                    <div className="card-header bg-secondary text-white">
                      <h3>TO DO</h3>
                    </div>
                    {todoItems}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center mb-2">
                    <div className="card-header bg-primary text-white">
                      <h3>In Progress</h3>
                    </div>
                  </div>

                  {inProgressItems}
                </div>

                <div className="col-md-4">
                  <div className="card text-center mb-2">
                    <div className="card-header bg-success text-white">
                      <h3>Done</h3>
                    </div>
                  </div>

                  {doneItems}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      }
    };
    boardContent = board(projectTasks);
    return (
      <div className="container">
        <Link to="/addProjectTask" className="btn btn-primary mb-3">
          <i className="fas fa-plus-circle"> Create Project Task</i>
        </Link>
        <br />
        <hr />
        {boardContent}
      </div>
    );
  }
}
ProjectBoard.propTypes = {
  getAllTasks: PropTypes.func.isRequired,
  projectTasks: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projectTasks: state.projectTasks
});

export default connect(
  mapStateToProps,
  { getAllTasks }
)(ProjectBoard);
