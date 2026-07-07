import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>

    <RouterProvider router={routes} />
    {/* <App /> */}

  </StrictMode>
)
