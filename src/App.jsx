import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectFeed from "./components/ProjectFeed/ProjectFeed";
import ProjectView from "./components/ProjectView/ProjectView";
import Header from "./components/Header/Hearder";

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<ProjectFeed />} />
                <Route path="/project/:id" element={<ProjectView />} />
            </Routes>
        </Router>
    );
};

export default App;