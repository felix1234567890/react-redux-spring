import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProjectBoard from "./components/ProjectBoard";
import AddProjectTask from "./components/ProjectTask/AddProjectTask";
import UpdateProjectTask from "./components/ProjectTask/UpdateProjectTask";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<ProjectBoard />} />
            <Route path="/addProjectTask" element={<AddProjectTask />} />
            <Route
              path="/updateProjectTask/:pt_id"
              element={<UpdateProjectTask />}
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
