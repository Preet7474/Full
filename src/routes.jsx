import { createBrowserRouter } from "react-router-dom";
import LogInForm from "./Components/login";
import RegisterForm from "./Components/register";
import Dashboard from "./Components/dashboard";
import App from './App.jsx'
import Home from "./Components/Home.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "login",
        element: <LogInForm />
      },
      {
        path: "register",
        element: <RegisterForm />
      },
      {
        path: "dashboard/:id",
        element: <Dashboard />
      }
    ]
  }
]);

export default routes;