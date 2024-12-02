import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectFeed from "./components/ProjectFeed/ProjectFeed";
import ProjectView from "./components/ProjectView/ProjectView";
import Header from "./components/Header/Hearder";
import Profile from "./components/Profile/Profile";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProjectFeed />} />
        <Route path="/project/:id" element={<ProjectView />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
