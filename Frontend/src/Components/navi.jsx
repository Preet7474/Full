import React from "react";

const NavBarr = () => {

  // bg-cyan-500  text-white
  return (
    <nav className="fixed top-0 z-10 w-full h-16 bg-slate-900 border-b border-cyan-500/20 select-none">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">

        {/* Logo */}
        <div className="font-bold text-lg sm:text-3xl text-cyan-300">
          Epic_PassManager
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-4 sm:gap-8 text-sm sm:text-lg text-cyan-300">
          <li>
            <a href="/" className="hover:text-cyan-500">
              Home
            </a>
          </li>

          <li>
            <a
              href="http://localhost:5173/Login"
              className="hover:text-cyan-500 "
            >
              Login
            </a>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default NavBarr;
