import React, { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../components/Sidebar'
import { FiMenu } from "react-icons/fi";

export default function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      {/* Sidebar Section */}
      {sidebarOpen && (
        <div
          className={`md:relative z-20 fixed h-full transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar toggleSidebar={() => setSidebarOpen(false)} />
        </div>
      )}

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 text-green-800 text-2xl z-30"
        >
          <FiMenu />
        </button>
      )}

      {/* Main Content Section */}
      <div className=" flex-1 overflow-y-auto transition-all duration-300 ">
        <div
          className={`bg-white rounded-2xl shadow-md p-6 min-h-screen ${
            sidebarOpen ? "md:m-6 m-2" : "md:m-10 mt-4"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
