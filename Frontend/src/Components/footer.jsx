import React from "react";

// const footer = () => {
//   return (
   
//     <div className=" bg-slate-900 border-t border-cyan-500/20 text-cyan-300 font-bold flex justify-between items-center px-8 py-6 mt-10 w-full h-10 fixed bottom-0 ">
//         <div className="mx-auto flex items-center justify-center sm:text-2xl  text-sm ">
//              Created By ReactJS & TailwindCSS  | 2026 &copy; All Rights Reserved
//         </div>
//     </div>
//   );
// };

const Footer = () => {
  return (
    // <footer className="fixed bottom-0 left-0 z-50 w-full  border-t border-cyan-500/20 bg-slate-900 px-4 py-2 text-center text-sm font-bold text-cyan-300 sm:px-8 sm:text-base select-none">
    <footer className="z-50   border-t border-cyan-500/20 bg-slate-900 px-4 py-2 text-center text-sm font-bold text-cyan-300 sm:px-8 sm:text-base select-none">
      <div>
        Created with ReactJS & TailwindCSS&nbsp; | &nbsp;© 2026 All Rights Reserved
      </div>  
    </footer>
  );
};

export default Footer;


// export default footer;
