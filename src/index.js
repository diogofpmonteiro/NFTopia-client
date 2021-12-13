import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProviderWrapper } from "./context/auth.context";
import { ThemeProviderWrapper } from "./context/theme.context";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProviderWrapper>
        <AuthProviderWrapper>
          <App />
        </AuthProviderWrapper>
      </ThemeProviderWrapper>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
