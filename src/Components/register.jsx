import React from "react";
import navi from "./navi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const RegisterForm = ({ setShowRegister }) => {
    const navigate = useNavigate();
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

        const at = form.email.indexOf("@");
        const dot = form.email.lastIndexOf(".")
        if (at < 1 || dot < at + 2 || dot === form.email.length - 1) {
            alert("Enter a Valid Email ")
            toast.error("Enter a Valid Email ");
            return;
        }

        const res = await fetch("http://localhost:4000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });
        const data = await res.json();

        // console.log(data.message);
        if (!res.ok) {
            alert(data.message);
            toast.error(data.message)
            return;
        }
        // alert("Registration Successful!");
        toast.success(" User Registration Successfull ")
        // console.log(data)
        setform({ email: "", name: "", password: "" });
        navigate("/Login");
    }
    return (

        <div
            className="max-w-7xl  h-full flex justify-center items-center bg-cover bg-center"
            style={{
                background:
                    "linear-gradient(135deg, #06141B 0%, #11212D 40%, #253745 100%)",
            }}
        >
            <div className="text-center">
                <h1
                    className="sm:text-4xl text-2xl font-bold mt-16 mb-6 text-cyan-300"
                    style={{
                        textShadow: "0 0 10px #22d3ee, 0 0 20px #06b6d4",
                    }}
                >
                    Register Here
                </h1>

                <form
                    className=" mb-10
        sm:w-95 w-70
        backdrop-blur-md
        bg-cyan-950/30
        border
        border-cyan-400/30
        rounded-3xl
        sm:px-8 px-10 py-3
        shadow-[0_0_25px_rgba(34,211,238,0.4)]
      "  >
                    <div className="mb-4">
                        <label className="block text-cyan-200 text-left mb-1">
                            Name
                        </label>
                        <input name="name" type="text" onChange={handleIt} value={form.name} placeholder="Your Name" className=" sm:w-full p-3 rounded-xl bg-slate-900/70 border border-cyan-500/40 text-cyan-100  placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                    </div>

                    <div className="mb-4">
                        <label

                            className="block text-cyan-200 text-left mb-1"
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
                            // htmlFor="email"
                            className="block text-cyan-200 text-left mb-1"
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
                        onClick={handleRegistration}
                        className="
          w-full
          py-3
          rounded-xl
          font-semibold
          text-slate-900
          bg-cyan-400
          hover:bg-cyan-300
          transition-all
          duration-300
          shadow-[0_0_20px_rgba(34,211,238,0.6)]
        "
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
