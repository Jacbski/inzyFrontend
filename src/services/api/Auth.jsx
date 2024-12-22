import request from "./Request";

// compendium for all requsets form auth-like
export const login = (username, password) => {
  return request("/auth/authenticate", "POST", {
    userName: username,
    password,
  });
};

export const register = (username, email, password) => {
  return request("/auth/register", "POST", {
    userName: username,
    email,
    password,
  });
};
