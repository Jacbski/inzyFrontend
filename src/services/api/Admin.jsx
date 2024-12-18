import request from "./request";

// compendium for all requsets form Admin-like
export const sendMessageToAdmin = (title, message) => {
  return request("/api/admin/message", "POST", { title, message }, true);
};
