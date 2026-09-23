import React, { useContext, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import SidebarAccount from "../components/SidebarAccount";
import SidebarWorkspace from "../components/SidebarWorkspace";
import { FiMenu } from "react-icons/fi";
import { Bell, CircleUserRound, Moon, Sun } from "lucide-react";
import InventoryProvider from "../context/InventoryContext";
import { AuthContext } from "../context/authContext";

const headerButtonClass =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-700 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2";

const profileButtonClass =
  "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-2 py-2 text-gray-700 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 md:px-3";
 
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  const fullName = [authUser.firstName, authUser.lastName]
    .filter(Boolean)
    .join(" ");

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

        <div className="min-w-0 flex-1 overflow-y-auto">
          <header
            className={`sticky top-0 z-10 flex h-20 shrink-0 items-center justify-end gap-0.5 bg-gray-50 sm:gap-2 md:z-30 ${
              sidebarOpen
                ? "mt-8 max-md:ml-64 max-md:mr-1 md:mx-6"
                : "mx-2 mt-8 md:mx-10"
            }`}
          >
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {}}
              className={`relative z-30 ${headerButtonClass}`}
            >
              <Bell size={22} aria-hidden="true" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                1
              </span>
            </button>
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setIsDarkMode((dark) => !dark)}
              className={`relative z-30 ${headerButtonClass}`}
            >
              {isDarkMode ? (
                <Sun size={22} aria-hidden="true" />
              ) : (
                <Moon size={22} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              aria-label="Profile"
              onClick={() => {}}
              className={`relative z-30 min-w-0 max-md:shrink ${profileButtonClass}`}
            >
              <CircleUserRound size={22} className="shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate text-sm font-medium leading-tight">
                {fullName}
              </span>
            </button>
          </header>

          <div
            className={`bg-white rounded-2xl shadow-md p-6 min-h-screen ${
              sidebarOpen
                ? "mx-2 mt-2 mb-2 md:mx-6 md:mt-6 md:mb-6"
                : "mx-2 mt-2 mb-2 md:mx-10 md:mt-10 md:mb-10"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </InventoryProvider>
  );
}
