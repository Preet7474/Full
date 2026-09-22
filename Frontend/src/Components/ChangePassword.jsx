import React from 'react'
import { toast } from "react-toastify";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";


const ChangePassword = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const location = useLocation();
    const { purpose } = location.state || {};
    const [form, setform] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const [toggle, settoggle] = useState(true);
    const [toggle2, settoggle2] = useState(true);
    const [toggle3, settoggle3] = useState(true);

    const ChangePass = async (e) => {
        e.preventDefault();
        //use same commponent for forgotpassword also
        const endpoint = purpose === "forgot" ? "/reset-password" : "/changePassword";

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ form })

        });
        // alert("Password Changed Successfully");
        const resData = await res.json();
        if (!res.ok) {
            toast.error(resData.message);
            return;
        }

        if (purpose !== "forgot" && res.ok) {
            toast.success("Password Changed Successfully");
            navigate("/login");
        }

        if (purpose === "forgot" && res.ok) {
            toast.success("Password Reset Successfully");
            navigate("/login");
        }

        setform({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        })
    }

    return (

        <div className='flex flex-col gap-10 items-center w-full h-screen bg-sky-100'>

            <h2 className='text-4xl font-bold text-cyan-600 p-5 select-none text-center'>{purpose === "forgot" ? "Reset Password" : "Change Password"}</h2>
            <form className="flex flex-col gap-4  w-full max-w-md px-4 ">
                <div className={purpose === "forgot" ? 'hidden' : 'relative'}>

                    <input type={!toggle ? "text" : "password"}
                        value={form.currentPassword} onChange={(e) => setform({ ...form, currentPassword: e.target.value })}
                        placeholder="Current Password"
                        className='border border-cyan-600 focus:outline-none focus:ring-3 focus:ring-cyan-400 rounded-xl w-full px-4 py-2'

                    />
                    <span onClick={() => settoggle(!toggle)}
                        className="absolute right-4 top-2.5  select-none cursor-pointer text-cyan-900 " >
                        <i
                            className={toggle ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
                        ></i>
                    </span>
                </div>


                <div className='relative w-full '>
                    <input type={!toggle2 ? "text" : "password"}
                        value={form.newPassword} onChange={(e) => setform({ ...form, newPassword: e.target.value })}
                        placeholder="New Password" className='border border-cyan-600 focus:outline-none focus:ring-3 focus:ring-cyan-400 rounded-xl w-full max-w-md px-4 py-2  ' />
                    <span onClick={() => settoggle2(!toggle2)}
                        className="absolute right-4 top-2.5  select-none cursor-pointer text-cyan-900 " >
                        <i
                            className={toggle2 ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
                        ></i>
                    </span>
                </div>

                <div className='relative w-full'>
                    <input type={!toggle3 ? "text" : "password"}
                        value={form.confirmPassword} onChange={(e) => setform({ ...form, confirmPassword: e.target.value })}
                        placeholder="Confirm New Password" className='border border-cyan-600  focus:outline-none focus:ring-3 focus:ring-cyan-400 rounded-xl w-full max-w-md px-4 py-2' />
                    <span onClick={() => settoggle3(!toggle3)}
                        className="absolute right-4 top-2.5 select-none cursor-pointer text-cyan-900 " >
                        <i
                            className={toggle3 ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
                        ></i>
                    </span>

                </div>
                <button type="submit" onClick={ChangePass} className='bg-cyan-400 text-slate-900 p-2 font-bold rounded cursor-pointer hover:bg-cyan-600 h-10 hover:scale-105 transition duration-300 ease-in-out sm:text-lg text-sm w-full '>
                    {purpose === "forgot" ? "Reset Password" : "Change Password"}
                </button>
            </form>
        </div>
    )
}

export default ChangePassword;
