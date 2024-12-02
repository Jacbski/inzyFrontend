import request from "./request";

// compendium for all requsets form user-like
export const getCurrentUser = () => {
  return request("/api/users/current-user", "GET", null, true);
};
