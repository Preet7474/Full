import React from "react";
import { Link } from "react-router-dom";

const NavBarr = () => {

  
  return (
     <nav className="sticky top-0 z-60 w-full h-16 bg-slate-900 border-b border-cyan-500/20 select-none">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        <div className="font-bold text-lg sm:text-3xl text-cyan-300">
          Epic_PassManager
        </div>
        <ul className="flex items-center gap-4 sm:gap-8 text-sm sm:text-lg text-cyan-300">
          <li>
            <Link to="/" className="hover:text-cyan-500">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/Login"
              className="hover:text-cyan-500 "
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBarr;
