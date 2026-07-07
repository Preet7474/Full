import React from 'react'
import { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast, Bounce } from "react-toastify";

const dashboard = () => {

    const [toggle, settoggle] = useState(false);
    const ref = useRef();
    const [PasswordArray, setPasswordArray] = useState([]);
    const [form, setform] = useState({ site: "", name: "", password: "" });
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();
    // const user = JSON.parse(localStorage.getItem("LoggedUSER"));  //the user who logged in 
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);
    // const token = JSON.parse(localStorage.getItem("Token")); //Always Parse the token

    // const Loggeduser = req.cookies.LoggedUser || req.headers.authorization.split(' ')[1];




    useEffect(() => {
        fetchPass();
        //  {PasswordAray.length() }

        // const user = JSON.parse(localStorage.getItem("LoggedUSER"));

    }, []);


    const fetchPass = async () => {

        // const loggedUser = JSON.parse(localStorage.getItem("LoggedUSER"));
        // console.log(loggedUser);
        //    console.log("Token is :",token)

        const res = await fetch(`http://localhost:4000/ShowPasswords`, {
            method: "GET",
            credentials: "include",
            headers: {
                // "Authorization": `Bearer ${token}`,
                // "LoggeduserId": loggedUser._id   No Need As auth middleware is providing it
            }
        });

        const data = await res.json();
        setPasswordArray(data);

        // if (!user) {
        //     navigate("/login");
        // }
        // console.log(Array.isArray(data));
        // console.log(data);
        // console.log("All fetched Passwords =>", data)
    };

    const SaveNow = async (e) => {
        if (form.name === "" || form.password === "" || form.site === "") {
            alert("Please Fill All The Fields");
            return;
        }

        if (form.password.length < 6) {
            alert("Password Must Be At Least 6 Characters Long");
            return;
        }

        const existingEntry = PasswordArray.find(
            (i) =>
                i.site.trim().toLowerCase() === form.site.trim().toLowerCase() &&
                i.name.trim().toLowerCase() === form.name.trim().toLowerCase() &&   
                i._id !== editId 
        );

        if (existingEntry) {
            alert("This Username Already Exists At This Site Please Try Another One");
            return;
        }

        if (editId) {
            updateNow(editId);
            setform({ site: "", name: "", password: "" });
            setEditId(null);
            return;
        }

        // const loggedUser = JSON.parse(localStorage.getItem("LoggedUSER"));
        // console.log("User Ki Logged Id => \n\n", loggedUser);

        const res = await fetch(`http://localhost:4000/add_password`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                // "LoggeduserId": loggedUser._id,
                // "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(form)
        });

        const savedPassword = await res.json();

        setPasswordArray(prev => [...prev, savedPassword]);
        //Adding/Saving  new Passwords to our Array


        setform({ site: "", name: "", password: "" });

        toast.success('Password Saved Successfully!')


    };


    const updateNow = async (id) => {

        const { _id, ...dataToSend } = form;
        // console.log(`_id :${_id}  \n\n Data to send : ${dataToSend}`)

        const res = await fetch(`http://localhost:4000/edit_password/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend)
        });
        const data = await res.json();
        // console.log("Updated Password =>", data);

        setPasswordArray(prev =>
            prev.map(item => item._id === id ? data : item)
        );
        toast.success('Password Updated Successfully!')
        //this line matches the id of the item being edited with the id of the item in the array and if it matches it updates that item with the new data otherwise it keeps the old item as it is

    }

    const editPassword = async (id) => {
        const value = PasswordArray.find((i) => i._id === id);
        if (value) {
            setform(value);
            setEditId(id);
        }
    };


    const deletePassword = async (id) => {
        //Removing Only The Deleted  On Which Cliked from Array
        setPasswordArray((p) => p.filter((i) => i._id !== id));

        await fetch(`http://localhost:4000/del_password/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                // "Authorization": `Bearer ${token}`,
            }
        });
        toast.success('Deleted Successfully !');
    };


    const hadleReset = async () => {

        if (PasswordArray.length === 0) {
            alert("Already Empty (No Saved Passwords)");
            return;
        }

        const c = confirm("Are you sure You Want To Delete All Saved Passwords !")
        if (c) {
            const res = await fetch(`http://localhost:4000/RESET`, {
                method: "DELETE",
                credentials: 'include',
            });

            if (res.ok) {
                setPasswordArray([]);
            }
            toast.success('All Saved Passwords Deleted Successfully !');
        }

    }

    const handleIt = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

    const handleLOGOUT = async () => {
        const res = await fetch('http://localhost:4000/LogOut', {
            method: "GET",
            credentials: 'include',
            headers: {
                // "Authorization": `Bearer ${token}`,
            }
        })

        if (res.ok) {
            // localStorage.removeItem("LoggedUSER");
            // alert(' User LogOUT Successfully')
            toast.success('Logged Out Successfull ');
            navigate('/Login')
        }

    }
    const Userprofile = async () => {
        setShowProfile(true)
        const val = await fetch('http://localhost:4000/Profile', {
            method: "GET",
            credentials: 'include',
        })
        // console.log("Val", val)
        const USER = await val.json();
        setUser(USER);
        // console.log("Profile Opened :", USER)


    };

    return (
        <div className=" bg-sky-100 flex flex-col gap-1 items-center py-5 overflow-x-auto">

            <div className='flex  w-1/2  sm:flex-row justify-around sm:gap-70 sm:w-full mt-20 mb-5 border-black '>
                {/* <button onClick={handleLOGOUT}
                    className='bg-cyan-400 p-3  mx-3  rounded-2xl text-white absolute right-2 top-0'>LogOut</button> */}

                <p className="sm:text-2xl  text-cyan-900  ">Your Personal Password Manager</p>

                <button onClick={Userprofile} className='bg-cyan-400 text-slate-900 p-2  mx-3 font-bold  rounded-full cursor-pointer  hover:bg-cyan-600 h-10'>
                    👤
                </button>

                {showProfile && user && (<div className="fixed inset-0 z-10  bg-cyan-950/50 " onClick={() => setShowProfile(false)} >
                    <div className="absolute right-0 top-0 h-full w-80 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 
                 border-l border-cyan-500 p-6 " onClick={(e) => e.stopPropagation()} >
                        <h2 className="text-2xl text-cyan-300 mb-4 flex flex-col items-center gap-4  "> User Profile
                            <div className="w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center  text-3xl font-bold">
                                {user.name[0].toUpperCase()}
                            </div>
                        </h2>
                        <p className="text-white mt-12 border-b-1"> Name: {user.name}  </p>
                        <p className="text-white mt-4 border-b-1"> Email: {user.email} </p>
                        <p className="text-white mt-4 border-b-1"> Saved Passwords: {PasswordArray.length}</p>
                        <button className="mt-15 w-full bg-red-500 py-2 rounded text-white text-xl" onClick={handleLOGOUT}  >
                            Logout
                        </button>
                    </div>
                </div>
                )
                }


            </div>


            {/* <p className="text-2xl mt-20 mb-10 text-cyan-900">Your Personal Password Manager</p> */}

            <div className=" w=1/2 sm:w-full cont flex flex-col bg-sky-200 items-center  gap-8  p-10 max-w-5xl mx-auto  rounded-lg  ">

                <input
                    type="text"
                    value={form.site}
                    onChange={handleIt}
                    placeholder="Enter Site Name/Link"
                    name="site"
                    className=" border-1 rounded-2xl w-full px-3 py-1 border-cyan-600 focus:outline-none focus:ring-3 focus:ring-cyan-400"
                />
                <div className="flex sm:gap-5 gap-8 w-full sm:flex-row  flex-col">
                    <input
                        type="text"
                        value={form.name}
                        onChange={handleIt}
                        name="name"
                        placeholder="Enter Username"
                        className=" w-full border-1 rounded-2xl px-3 py-0.5  border-cyan-600 focus:outline-none focus:ring-3 focus:ring-cyan-400   "
                    />

                    <div className=" flex relative px- ">
                        <input
                            type={toggle ? "text" : "password"}
                            ref={ref}
                            id=" "
                            value={form.password}
                            onChange={handleIt}
                            name="password"
                            placeholder="Enter Password"
                            className=" w-full border rounded-2xl pl-3 pr-10 py-1 overflow-auto  border-cyan-600 focus:outline-none focus:ring-3 focus:ring-cyan-400 "
                        />
                        <span
                            onClick={() => settoggle(!toggle)}
                            className="absolute right-3 top-1 select-none cursor-pointer text-cyan-900 "
                        >
                            <i
                                className={toggle ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
                            ></i>
                        </span>
                    </div>
                </div>
                <button
                    onClick={SaveNow}
                    className="border-black cursor-pointer  rounded-lg p-3.5 m-2 bg-cyan-500  text-indigo-900 font-bold hover:bg-cyan-600 focus:outline-none focus:ring-3 focus:ring-cyan-900 "
                >
                    Add Password
                </button>
            </div>



            {/* <div className=" min-w-[1000px] max-w-3xl mx-auto mt-10 bg-cyan-500 rounded-lg mb-15"> */}
            <div className=" sm:min-w-250    max-w-3xl mx-auto mt-10 bg-cyan-500 rounded-lg mb-15 min-w-1/6">

                <div className="max-w-7xl mx-auto flex  sm:flex-row sm:items-center items-start justify-between gap-3 px-4 py-3">
                    <p className="text-base sm:text-xl text-cyan-900 font-bold text-center sm:text-left">
                        Your Passwords Will Appear Here
                    </p>

                    <button
                        onClick={hadleReset}
                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-xl w-full max-w-50 sm:w-auto transition cursor-pointer"
                    >
                        Delete ALL
                    </button>
                </div>
                {PasswordArray.length == 0 && <div className="text-red-500 text-xl mx-auto p-4">No Saved Passwords !</div>}
                {PasswordArray.length != 0 && (
                    // <table className="border table-fixed sm:w-full w-1/2 ">
                    <table className="border min-w-full overflow-x-auto ">
                        <thead>
                            <tr className="py-2 border border-white text-center text-cyan-800">
                                <th className="py-2 border border-white text-center w-30 ">
                                    Site Name
                                </th>
                                <th className="py-2 border border-white text-center w-30">
                                    UserName
                                </th>
                                <th className="py-2 border border-white text-center w-30">
                                    Password
                                </th>
                                <th className="py-2 border border-white text-center w-30">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PasswordArray.map((items, index) => {
                                return (
                                    <tr
                                        className="py-2 border border-white text-center text-white "
                                        key={index}
                                    >
                                        <td className="py-2 border border-white text-center w-30 relative sm:pr-10  ">


                                            {items.site}
                                            <a
                                                className="text-blue-900  absolute right-3 top-0 select-none cursor-pointer  "
                                                href={
                                                    items.site.startsWith("http://") ||
                                                        items.site.startsWith("https://")
                                                        ? items.site
                                                        : `https://${items.site}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {/* Open */}
                                                <i className="bi bi-arrow-up-right-square"></i>
                                            </a>


                                        </td>
                                        <td className="py-2 border border-white text-center w-30 relative  sm:pr-10 ">
                                            {items.name}
                                            <span
                                                onClick={() => {
                                                    navigator.clipboard.writeText(items.name)
                                                    toast.success('Copied to Clipboard !');
                                                }}

                                                className="absolute right-3 top-0 select-none cursor-pointer text-blue-900 overflow-x-hidden  "
                                            >
                                                {/* Copy */}
                                                <i className="bi bi-copy"></i>
                                            </span>
                                        </td>
                                        <td className="py-2 border border-white text-center w-30 relative pr-5 ">
                                            {"*".repeat(items.password.length)}
                                            <span
                                                onClick={() => {
                                                    navigator.clipboard.writeText(items.password)
                                                    toast.success('Copied to Clipboard !');
                                                }}
                                                className="absolute right-3 top-0 select-none cursor-pointer text-blue-900  "
                                            >
                                                {/* Copy */}
                                                <i className="bi bi-copy"></i>

                                            </span>
                                        </td>

                                        <td className="py-2 border border-white text-center w-30">
                                            <span
                                                onClick={() => {
                                                    editPassword(items._id);
                                                }}
                                                className="cursor-pointer text-blue-700 hover:text-blue-700"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </span>
                                            <span
                                                onClick={() => deletePassword(items._id)}
                                                className="cursor-pointer text-red-500 hover:text-red-700 ml-2"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};


export default dashboard
