import React from "react";
import useAuth from "../../hooks/useAuth";

function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="profile">
      <h1>Profile</h1>
      {currentUser ? (
        <div>
          <p>Welcome, {currentUser.username}!</p>
          <p>Email: {currentUser.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default Profile;
//temp
