import React, { useContext, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import SidebarAccount from "../components/SidebarAccount";
import SidebarWorkspace from "../components/SidebarWorkspace";
import { FiMenu } from "react-icons/fi";
import InventoryProvider from "../context/InventoryContext";
import { AuthContext } from "../context/authContext";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { authUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  const isWorkspace = location.pathname.startsWith("/dashboard/workspace");
  const SidebarComponent = isWorkspace ? SidebarWorkspace : SidebarAccount;

  return (
    <InventoryProvider>
      <div className="flex h-screen w-full bg-gray-50 relative">
        {sidebarOpen && (
          <div
            className={`md:relative z-20 fixed h-full transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SidebarComponent toggleSidebar={() => setSidebarOpen(false)} />
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
    </InventoryProvider>
  );
}
