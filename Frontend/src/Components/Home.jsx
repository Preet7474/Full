import React from 'react'
import { useNavigate} from 'react-router-dom'


const Home = () => {
    const navigate = useNavigate();
    return (
        <div>

            <section className="min-h-full w-full flex flex-col justify-center items-center 
            bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 text-white sm:p-2 p-10 select-none ">
   

                <h1 className=" font-bold text-cyan-300 mb-4 sm:text-6xl  text-xl  ">
                    Epic_PassManager
                </h1>

                <p className="text-xl text-cyan-100 max-w-xl text-center mb-8">
                    Your Personal Password Manager
                </p>
                <p className="text-xl text-cyan-100 max-w-xl text-center mb-8">
                    Store and manage all your passwords securely in one place.
                </p>

                <button
                    onClick={() => navigate('/register')}
                    className="px-8 py-4 mt-2 rounded-xl bg-cyan-400 text-slate-900 font-semibold hover:bg-cyan-300 
                    hover:scale-105 transition-transform duration-300 sm:text-lg text-sm cursor-pointer"
                >
                    Get Started
                </button>
                

            </section>
        </div>
    )
}

export default Home
