import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectFeed from "./components/ProjectFeed/ProjectFeed";
import ProjectView from "./components/ProjectView/ProjectView";
import Header from "./components/Header/Hearder";
import Profile from "./components/Profile/Profile";
import AddPost from "./components/AddPost/AddPost";
import Favorites from "./components/Favorites/Favorites.jsx";
import MyPostsFeed from "./components/MyPostsFeed/MyPostsFeed.jsx";

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<ProjectFeed />} />
                <Route path="/project/:id" element={<ProjectView />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-post" element={<AddPost />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/my-posts" element={<MyPostsFeed />} />
            </Routes>
        </Router>
    );
};

export default App;