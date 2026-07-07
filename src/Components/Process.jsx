import React from "react";

import { useRef, useEffect, useState } from "react";

const Process = () => {

  const [toggle, settoggle] = useState(false);
  const ref = useRef();
  const [PasswordArray, setPasswordArray] = useState([]);
  const [form, setform] = useState({ site: "", name: "", password: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPass();
  }, []);

  const fetchPass = async () => {
    const res = await fetch("http://localhost:4000/ShowPasswords", {
      method: "GET",
    });

    const data = await res.json();
    setPasswordArray(data);
    console.log(data)
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
    
    const existingUser = PasswordArray.find(
      (i) => i.name.trim() === form.name.trim(),
    );
    const sameSite = PasswordArray.find(
      (i) => i.site.trim() === form.site.trim(),
    );
    if (existingUser && sameSite) {
      alert("This Username Already Exists At This Site Please Try Another One");
      return;
    }
    
    if (editId) {
      updateNow(editId);
      setEditId(null);
      return;
    }
    
    const res = await fetch("http://localhost:4000/add_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });
    const savedPassword = await res.json();
    
    setPasswordArray(prev => [...prev, savedPassword]);
    //Adding/Saving  new Passwords to our Array

    setform({ site: "", name: "", password: "" });
  };


  const updateNow = async (id) => {

    const { _id, ...dataToSend } = form;

    const res = await fetch(`http://localhost:4000/edit_password/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSend)
    });
    const data = await res.json();
    console.log("Updated Password =>", data);

    setPasswordArray(prev =>
      prev.map(item => item._id === id ? data : item)
    );
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
      method: "DELETE"
    });
  };

  const handleIt = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className=" bg-sky-100 flex flex-col gap-1 items-center py-5 ">
      <p className="text-2xl text-cyan-900">Your Personal Password Manager</p>
      <div className="cont flex flex-col bg-sky-200 items-center  gap-8  p-10   min-w-[800px] max-w-5xl mx-auto  rounded-lg">
        <input
          type="text"
          value={form.site}
          onChange={handleIt}
          placeholder="Enter Site Name/Link"
          name="site"
          className=" border-1 rounded-2xl w-full px-3 py-0.5 border-cyan-600"
        />
        <div className="flex gap-5 w-full">
          <input
            type="text"
            value={form.name}
            onChange={handleIt}
            name="name"
            placeholder="Enter Username"
            className=" w-full border-1 rounded-2xl px-3 py-0.5  border-cyan-600   "
          />

          <div className=" flex relative px-2 ">
            <input
              type={toggle ? "text" : "password"}
              ref={ref}
              id=" "
              value={form.password}
              onChange={handleIt}
              name="password"
              placeholder="Enter Password"
              className=" w-full border-1 rounded-2xl px-3 pr-10  border-cyan-600 "
            />
            <span
              onClick={() => settoggle(!toggle)}
              className="absolute right-4 top-1 select-none cursor-pointer text-cyan-900 "
            >
              <i
                className={toggle ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}
              ></i>
            </span>
          </div>
        </div>
        <button
          onClick={SaveNow}
          className="border-black  rounded-lg p-3.5 m-2 bg-cyan-500  text-indigo-900 font-bold hover:bg-cyan-400 hover:font-mono hover:border-1 border-cyan-950"
        >
          Add Password
        </button>
      </div>

      <div className="PaswordLayout min-w-[1000px] max-w-3xl mx-auto mt-10 bg-cyan-500 rounded-lg mb-15">
        <p className=" text-xl p-4  text-cyan-900 font-bold">
          Your Passwords Will Appear Here
        </p>
        {PasswordArray.length == 0 && <div className="text-red-500 text-xl mx-auto p-4">No Saved Passwords !</div>}
        {PasswordArray.length != 0 && (
          <table className="border table-fixed w-full ">
            <thead>
              <tr className="py-2 border border-white text-center text-cyan-800">
                <th className="py-2 border border-white text-center w-30">
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
                    className="py-2 border border-white text-center text-white"
                    key={index}
                  >
                    <td className="py-2 border border-white text-center w-30 relative ">
                      {items.site}
                      <a
                        className="text-blue-900 absolute right-5 top-1 select-none cursor-pointer "
                        href={
                          items.site.startsWith("http://") ||
                            items.site.startsWith("https://")
                            ? items.site
                            : `https://${items.site}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                    </td>
                    <td className="py-2 border border-white text-center w-30 relative pr-10">
                      {items.name}
                      <span
                        onClick={() =>
                          navigator.clipboard.writeText(items.password)
                        }
                        className="absolute right-5 top-1 select-none cursor-pointer text-cyan-900 overflow-x-hidden  "
                      >
                        Copy
                      </span>
                    </td>
                    <td className="py-2 border border-white text-center w-30 relative pr-15 ">
                      {"*".repeat(items.password.length)}
                      <span
                        onClick={() =>
                          navigator.clipboard.writeText(items.password)
                        }
                        className="absolute right-5 top-1 select-none cursor-pointer text-cyan-900 "
                      >
                        Copy
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

export default Process;
