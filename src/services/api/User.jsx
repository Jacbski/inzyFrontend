import request from "./request";

// compendium for all requsets form user-like
export const getCurrentUser = () => {
  return request("/api/users/current-user", "GET", null, true);
};

export const updateUser = (userId, updatedData) =>
  request(`/api/users/${userId}`, "PUT", updatedData, true);

export const deleteUser = (userId) =>
  request(`/api/users/${userId}`, "DELETE", null, true);

export const uploadAvatar = (userId, file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return request(`/api/users/avatar/${userId}`, "POST", formData, true);
};

export const resetPassword = (email) => {
  return request("/api/users/resetPassword", "POST", { email });
};
