import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "./pages/auth";
import { List } from "./pages/List";
import { RegisterUser } from "./pages/registerUser";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <List />,
  },
  {
    path: "/register",
    element: <RegisterUser />,
  },
]);
