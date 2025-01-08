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
          <img
            src={
              currentUser && currentUser.avatar
                ? `data:image/jpeg;base64,${currentUser.avatar}`
                : "https://via.placeholder.com/150"
            }
            alt={
              currentUser
                ? `${currentUser.userName}'s profile picture`
                : "User profile"
            }
            className="header__user-icon"
          />
          <p>Welcome, {currentUser.userName}!</p>
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
