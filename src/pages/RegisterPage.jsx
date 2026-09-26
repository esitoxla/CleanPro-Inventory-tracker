import React from 'react'
import { useState, useContext } from 'react' 
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/authContext';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router';

export default function RegisterPage() {
 const { registerUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await registerUser(form);

    if (success) {
      toast.success("Account created!");
    } else {
      toast.error("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 px-4 sm:px-0 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center dark:bg-slate-800 dark:border dark:border-slate-700">
        <h1 className="text-3xl font-bold text-cyan-600 mb-4">
          Create Account
        </h1>

        <p className="text-gray-600 mb-6 dark:text-slate-400">
          Fill in your details to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-cyan-500 bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-cyan-500 bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
          />

          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-cyan-500 bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:outline-cyan-500 bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600 dark:text-slate-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:outline-cyan-500 bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600 dark:text-slate-400"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 dark:text-slate-400">
          Already have an account?{" "}
          <NavLink to="/" className="text-cyan-600 cursor-pointer">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}
