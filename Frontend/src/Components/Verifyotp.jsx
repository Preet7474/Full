import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";


const Verifyotp = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    // const [otpPurpose, setOtpPurpose] = useState("")

    const [timer, setTimer] = useState(30);

    const [resendDisabled, setResendDisabled] = useState(false);

    const { email, purpose } = location.state || {};

    useEffect(() => {
        if (!resendDisabled) return;
        // setTimer(30);

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setResendDisabled(false);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [resendDisabled])


    const CheckOtp = async () => {

        const endpoint = purpose === "login" ? "/verify-login" : "/verify-register";

        if (otp.trim() === "") {
            toast.error("Please enter the OTP.");
            return;
        }
        // const { email} = location.state || {};

        // console.log("Email :",email);

        const res = await fetch(`http://localhost:4000${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, otp, purpose })
        });

        const data = await res.json();

        if (purpose === "register" && res.ok) {
            console.log("RegisteredUser =>", data.user);
            toast.success('User Registered Successfully Now You can Login Here !');
            navigate(`/Login`);
        }

        if (purpose === "login" && res.ok) {
            // console.log("loggedUser =", data.user);
            toast.success('User Logged In Successfully !');
            navigate(`/dashboard/${data.user._id}`);
        }
        if (!res.ok) {
            console.log("Request StatusCode :", res.status);
            console.log("Error:", data.message);
            toast.error(data.message || 'An error occurred while verifying OTP.');
        }
    }


    const ResendOtp = async () => {

        if (resendDisabled) return;
        setResendDisabled(true);

        const res = await fetch("http://localhost:4000/resend-otp", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.status === 429) {
            toast.error(data.message);
            setTimer(data.secondsLeft);
            setResendDisabled(true);
            return;
        }
        if (res.ok) {

            // setTimer(30);
            // setResendDisabled(true);
            toast.success('OTP Resent Successfully !');
        } else {
            toast.error(data.message || 'An error occurred while resending OTP.');
        }
    }


    return (

        <div className='w-full h-screen border-2 flex flex-col justify-center items-center  
         bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 '>

            <div className="border-2 mb-12 sm:w-95 w-70 backdrop-blur-md bg-cyan-950/30  border-cyan-400/30 rounded-3xl sm:p-6  p-10 shadow-[0_0_25px_rgba(34,211,238,0.4)] flex flex-col justify-center items-center gap-3 "

            // <div className="border-2 p-10 rounded-3xl  bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-800 text-white 
            // flex flex-col justify-center items-center gap-3  "

            >

                <h1 className="text-3xl mb-5 text-center text-cyan-300 font-bold"
                    style={{
                        textShadow: "0 0 10px #22d3ee, 0 0 20px #06b6d4",
                    }}
                >Verify OTP</h1>

                <span className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter OTP Here"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="border p-2 rounded-2xl   bg-slate-900/70 text-white border-cyan-600 focus:outline-none     focus:ring-2  focus:ring-cyan-400 font-semibold placeholder-cyan-500"
                    />

                    <button onClick={ResendOtp} disabled={resendDisabled}
                        className="ml-1 bg-cyan-600  px-2 py-2 rounded hover:bg-cyan-800 transition-colors duration-300   text-sm cursor-pointer text-red-500 font-bold"
                    >
                        {resendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
                    </button>
                </span>

                <button onClick={CheckOtp}
                    // className="mt-4 bg-cyan-700 text-white px-4 py-2 rounded "  
                    className="px-8 py-3 mt-4 mx-2 rounded-xl bg-cyan-400 text-slate-900 font-semibold hover:bg-cyan-300 
                    hover:scale-105 transition-transform duration-300 sm:text-lg text-sm cursor-pointer"
                >
                    Verify OTP
                </button>
            </div>

        </div>
    )
}


export default Verifyotp;
