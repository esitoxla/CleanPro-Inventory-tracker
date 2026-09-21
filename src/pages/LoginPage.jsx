import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/authContext";
import toast from "react-hot-toast";


export default function LoginPage() {
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


 const handleSubmit = async (e) => {
   e.preventDefault();

   if (!phoneNumber) {
     return toast.error("Please enter your phone number");
   }

   if (!password) {
     return toast.error("Please enter your password");
   }

   try {
     const success = await login(phoneNumber, password);

     if (success) {
       toast.success("Login successful");
       navigate("/dashboard");
     } else {
       toast.error("Incorrect phone number or password");
     }
   } catch (error) {
     console.error("Login failed:", error);
     toast.error("Something went wrong. Please try again.");
   }
 };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-bold text-cyan-700 text-center">
            Akwaaba !!!
          </h1>
          <p className="text-gray-600 text-center text-lg font-medium">
            Please enter your phone number and password to continue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-5 mt-4"
        >
          <div>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:outline-cyan-500"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-12 border rounded-lg focus:outline-cyan-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition"
          >
            OK
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          <NavLink to="register" className="text-cyan-600 cursor-pointer">
            Sign up{" "}
          </NavLink>
          to get started
        </p>

        <footer className="text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()}
          <span className="font-semibold"> KoraWo Adwuma</span>. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
}
