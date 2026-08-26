
import Footer from "./Components/footer";
import NavBarr from "./Components/navi";
import Home from "./Components/Home";
import { Outlet } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        <NavBarr />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
        
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

      </div>
    </>
  );
}
export default App;


// const [showRegister, setShowRegister] = useState(true);
{/* {showRegister ? (<RegisterForm setShowRegister={setShowRegister} />) :
        (<LoginForm setShowRegister={setShowRegister} />)} */}


//  if (LoggedUser) {
//             return <Dashboard />
//         }
//         else {
//             return <Login />
//         }




// const [page, setPage] = useState("");

{/* {page === "login" && <Login setPage={setPage} />}
{page === "register" && <RegisterForm setPage={setPage} />} */}
{/* <RegisterForm/> */ }
{/* <Process/> */ }

