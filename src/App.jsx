import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectFeed from "./components/ProjectFeed/ProjectFeed";
import ProjectView from "./components/ProjectView/ProjectView";
import Header from "./components/Header/Hearder";
import Profile from "./components/Profile/Profile";
import AddPost from "./components/AddPost/AddPost";
import Favorites from "./components/Favorites/Favorites.jsx";
import MyPostsFeed from "./components/MyPostsFeed/MyPostsFeed.jsx";
import ReportedPostsFeed from "./components/ReportedPostsFeed/ReportedPostsFeed.jsx";
import Regulations from "./components/Regulations/Regulations.jsx";
import About from "./components/About/About.jsx";
import Contact from "./components/Contact/Contact.jsx";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import ContactFormMessages from "./components/ContactFormMessages/ContactFormMessages.jsx";
import ReportedComments from "./components/ReportedComments/ReportedComments.jsx";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProjectFeed />} />
        <Route path="/project/:id" element={<ProjectView />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/regulations" element={<Regulations />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-posts" element={<MyPostsFeed />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/reported-posts" element={<ReportedPostsFeed />} />
        <Route
          path="/contact-form-messages"
          element={<ContactFormMessages />}
        />
        <Route path="/reported-comments" element={<ReportedComments />} />
      </Routes>
    </Router>
  );
};

export default App;
