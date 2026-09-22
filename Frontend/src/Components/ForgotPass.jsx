import React from 'react'
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
const ForgotPass = () => {

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;


    const handleGetOtp = async (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim().toLowerCase();
        // console.log("Email Registered :", email);
        if (email.trim() === "") {
            toast.error("Please enter your registered email.");
            return;
        }

        const res = await fetch(`${API_URL}/forgot-password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email }),
        });

        const resData = await res.json();
        if (!res.ok) {
            toast.error(resData.message);
            return;
        }
        toast.success(resData.message);


        navigate("/verify-otp", {
            state: {
                purpose: "forgot",
                email: email
            }
        });

    }

    return (

        <div className='flex flex-col gap-2 items-center w-full h-screen bg-sky-100  select-none'>

          <div className='flex flex-col select-none'>
            <h1 className="text-2xl font-bold mb-2 mt-10 text-cyan-600 select-none">Forgot-Password</h1>
            <p className="text-lg text-gray-700 mb-4 select-none">Enter your Registered Email to get Reset Password Otp-Code</p>

            <form onSubmit={handleGetOtp} className="flex flex-col gap-2">
                <input type="email" placeholder='Enter your email here.....' name="email" className='w-full max-w-md px-4 py-2 border border-cyan-600  focus:outline-none focus:ring-3 focus:ring-cyan-400   rounded-xl select-none  ' />
                <div>
                    <button type="submit" className="bg-cyan-400 text-slate-900 hover:bg-cyan-300 py-2 px-4 rounded-xl font-bold cursor-pointer hover:scale-115 ease-in-out duration-300" > Get OTP</button>
                </div>
            </form>

            </div>
        </div>
    )
}


export default ForgotPass
