import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import App from "./App.jsx";
import "./reset.css";
import { AuthProvider } from "./services/auth/AuthContex.jsx";

Modal.setAppElement("#root");

const root = createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
      <App />
  </AuthProvider>
);
