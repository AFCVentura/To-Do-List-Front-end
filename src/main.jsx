// basic working
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// css (bootstrap and sass)
import "./index.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
      <App />
  </StrictMode>
);
