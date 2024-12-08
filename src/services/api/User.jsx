import request from "./request";

// compendium for all requsets form user-like
export const getCurrentUser = () => {
  return request("/api/users/current-user", "GET", null, true);
};

export const updateUser = (userId, updatedData) =>
  request(`/api/users/${userId}`, "PUT", updatedData, true);

export const deleteUser = (userId) =>
  request(`/api/users/${userId}`, "DELETE", null, true);
