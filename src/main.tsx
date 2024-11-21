import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { TaskProvider } from "./context/contextAPI.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TaskProvider>
    <App />
  </TaskProvider>
);
