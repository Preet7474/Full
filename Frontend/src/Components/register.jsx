import React from "react";
import navi from "./navi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const RegisterForm = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const [form, setform] = useState({ name: "", email: "", password: "" });
    const handleIt = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });

    };

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (form.name === "" || form.password === "" || form.email === "") {
            // alert("Please Fill All The Fields");
            toast.error("Please Fill All The Fields ")
            return;
        }

        if (form.name.length < 5) {
            // alert(" Name Must Be Minimum 5 Charcters");
            toast.error("Name Must Be Minimum 5 Charcters");
            return;
        }

        if (form.password.length < 8) {
            // alert(" Name Must Be Minimum 5 Charcters");
            toast.error("Password must be of 8 Charcters ");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            // setError("Please enter a valid email address");
            toast.error("Please enter a valid email address")
            return;
        }
        const normalizedEmail = form.email.trim().toLowerCase();

        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...form,
            email:normalizedEmail})
        });
        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message)
            return;
        }
        toast.success(" User Registration Successfull\n Now Please Verify Your Email ")

        navigate("/verify-otp", {
            state: {
                email: normalizedEmail,
                purpose: "register"
            }
        });

        setform({ email: "", name: "", password: "" });
    }
    return (

        <div className="w-full  h-screen flex justify-center items-center bg-cover bg-center
            bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 select-none" >
            <div className="text-center">

                <form className="my-2 sm:w-95 w-70 backdrop-blur-md bg-cyan-950/30 border border-cyan-400/30 rounded-3xl sm:px-8 px-10 py-3 shadow-[0_0_25px_rgba(34,211,238,0.4)] " >
                    <h1 className="sm:text-4xl text-2xl font-bold m-3 text-cyan-300"
                        style={{
                            textShadow: "0 0 10px #22d3ee, 0 0 20px #06b6d4",
                        }} >
                        Register Here
                    </h1>


                    <div className="mb-4">
                        <label className="block text-cyan-200 text-left mb-1">
                            Name
                        </label>
                        <input name="name" type="text" onChange={handleIt} value={form.name}
                            placeholder="Your Name" className="w-full p-3 rounded-xl bg-slate-900/70 border border-cyan-500/40 text-cyan-100  placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-cyan-200 text-left mb-1" >
                            Email
                        </label>
                        <input name="email" type="email" required onChange={handleIt} value={form.email}
                            placeholder="Your Email"
                            className="w-full p-3 rounded-xl bg-slate-900/70 border border-cyan-500/40  text-cyan-100  placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 " />
                    </div>
                    <div className="mb-4">
                        <label className="block text-cyan-200 text-left mb-1" >
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleIt}
                            value={form.password}
                            placeholder="Your Password"
                            className="w-full p-3 rounded-xl bg-slate-900/70 border border-cyan-500/40 text-cyan-100 placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                    </div>

                    <button
                        type="button"
                        onClick={handleRegistration}
                        className="w-full py-3 rounded-xl font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-105 sm:text-lg text-sm cursor-pointer "
                    >
                        Register
                    </button>
                    <p className="text-cyan-400 mt-2">Already an Account ?&nbsp;&nbsp;
                        <button type="button" className="underline cursor-pointer" onClick={() => navigate("/Login")}>Login Here</button>

                    </p>
                </form>
            </div>
        </div>

    );

}


export default RegisterForm;
