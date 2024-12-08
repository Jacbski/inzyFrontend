import React from "react";
import useAuth from "../../hooks/useAuth";
import Settings from "../Settings/Settings";
import "./css/profile.css";

function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="profile">
      <h1>Profile</h1>
      {currentUser ? (
        // w tym div profile picture nad welcom user
        <div>
          <p>Welcome, {currentUser.username}!</p>
          <p>Email: {currentUser.email}</p>
          <Settings />
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Profile;
//temp
