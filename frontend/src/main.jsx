import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import App from "./App";
import store from "./store/store";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  >
    <Provider store={store}>
      <BrowserRouter>
      <Toaster position="top-right" />
        <App />
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);  