import { createBrowserRouter } from "react-router-dom";
import LogInForm from "./Components/login.jsx";
import RegisterForm from "./Components/register.jsx";
import Dashboard from "./Components/dashboard.jsx";
import App from './App.jsx'
import Home from "./Components/Home.jsx";
import Verifyotp from "./Components/Verifyotp.jsx";

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
      },
      {
        path:"verify-otp",
        element: <Verifyotp/>
      }
      // ,
      // {
      //   path : "*",
      //   element : <h1>404 Not Found</h1>  
      // }
    ]
  }
]);

export default routes;