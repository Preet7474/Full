import React from "react";
import navi from "./navi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LogInForm = ({ setShowRegister }) => {


    // const token = JSON.parse(localStorage.getItem("Token"));
    const navigate = useNavigate();

    const [form, setform] = useState({ email: "", password: "" });
    const handleIt = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {

        const res = await fetch("http://localhost:4000/Login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                //  "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(form)
        });
        const LoggedUser = await res.json();
        setform({ email: "", password: "" });
        if (!res.ok) {
            // alert(LoggedUser.message);
            toast.error(LoggedUser.message);
            return;
        }

        if (res.ok) {
            toast.success('Otp Sent Successfully !');
            navigate("/verify-otp", {
                state: {
                    email: form.email,
                    purpose: "login"
                }
            });
        }

    }


    return (

        <div className="max-w-7xl  h-full flex justify-center items-center bg-cover bg-center 
bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 " >
            <div className="text-center ">
                <h1
                    className="sm:text-4xl text-2xl  font-bold mt-20 mb-7  text-cyan-300"
                    style={{
                        textShadow: "0 0 10px #22d3ee, 0 0 20px #06b6d4",
                    }}
                >
                    LogIn Here
                </h1>

                <form
                    className=" mb-12
       sm:w-95 w-70
        backdrop-blur-md
        bg-cyan-950/30
        border
        border-cyan-400/30
        rounded-3xl
        sm:p-6 p-9
        shadow-[0_0_25px_rgba(34,211,238,0.4)]
      "  >

                    <div className="mb-4">
                        <label
                            className="block text-cyan-200 text-left mb-2"
                        >
                            Email
                        </label>

                        <input
                            name="email"
                            type="email"
                            onChange={handleIt}
                            value={form.email}
                            placeholder="Your Email"
                            className="
            w-full
            p-3
            rounded-xl
            bg-slate-900/70
            border
            border-cyan-500/40
            text-cyan-100
            placeholder-cyan-500
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-400
          "
                        />
                    </div>


                    <div className="mb-4">
                        <label
                            className="block text-cyan-200 text-left mb-2"
                        >
                            Password
                        </label>

                        <input
                            name="password"
                            type="password"
                            onChange={handleIt}
                            value={form.password}
                            placeholder="Your Password"
                            className="
            w-full
            p-3
            rounded-xl
            bg-slate-900/70
            border
            border-cyan-500/40
            text-cyan-100
            placeholder-cyan-500
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-400
          "
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full py-3 rounded-xl font-semibold text-slate-900  bg-cyan-400 hover:bg-cyan-300 transition-all duration-300shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-105 sm:text-lg text-sm cursor-pointer "
                    >
                        LogIn
                    </button>
                    <p className="text-cyan-400 mt-4">New User ?&nbsp;&nbsp;
                        <button type="button" className="underline cursor-pointer"
                            onClick={() => navigate('/register')}>Register Here</button></p>
                </form>
            </div>
        </div>

    );

}


export default LogInForm;
