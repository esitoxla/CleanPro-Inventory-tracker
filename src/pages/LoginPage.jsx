import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/authContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!passcode) {
      return toast.error("Please enter your passcode");
    }

    try {
      const success = await login(passcode);

       if (success) {
         toast.success("Login successful");
         navigate("/dashboard");
       } else {
         toast.error("Incorrect passcode");
       }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Something went wrong. Please try again.");
     
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-200 via-pink-100 to-yellow-100 p-4">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6 w-full max-w-md transition-transform transform hover:scale-[1.02]">
        <h1 className="text-5xl font-bold text-cyan-700 text-center animate-pulse">
          Welcome ✨
        </h1>
        <p className="text-gray-600 text-center text-lg font-medium">
          Maame Esther, please enter your secret code to continue.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-5 mt-2"
        >
          <input
            type="text"
            className="px-4 py-3 border-2 border-cyan-300 rounded-lg focus:outline-none focus:border-cyan-600 transition-all duration-300 text-lg text-gray-700 placeholder:text-gray-400"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-cyan-500 hover:to-cyan-300 cursor-pointer"
          >
            OK
          </button>
        </form>

        <footer className="text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()}
          <span className="font-semibold"> CleanPro Tracker</span>. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
}
