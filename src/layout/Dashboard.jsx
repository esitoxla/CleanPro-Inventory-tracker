import React, { useContext, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import SidebarAccount from "../components/SidebarAccount";
import SidebarWorkspace from "../components/SidebarWorkspace";
import { FiMenu } from "react-icons/fi";
import { Bell, CircleUserRound, Moon, Sun } from "lucide-react";
import InventoryProvider from "../context/InventoryContext";
import { AuthContext } from "../context/authContext";
import { useTheme } from "../context/themeContext";
import { useLowStockAlerts } from "../hooks/useLowStockAlerts";

const headerButtonClass =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-700 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

const profileButtonClass =
  "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-2 py-2 text-gray-700 transition-colors bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 md:px-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

function NotificationBell() {
  const { lowStockProducts, count } = useLowStockAlerts();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg border border-gray-200 p-2 text-gray-700 bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 dark:bg-slate-800 dark:border dark:border-slate-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 dark:text-slate-100">
            <div className="flex items-center gap-2">
              <Bell size={16} />
              <span className="font-semibold text-sm">Notifications</span>
              {count > 0 && (
                <span className="bg-green-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
          </div>

          {count === 0 ? (
            <div className="p-4 text-sm text-gray-500 dark:text-slate-400">
              All products are well stocked.
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto">
              {lowStockProducts.map((p) => (
                <li key={p.id} className="p-4">
                  <p className="text-sm text-gray-800 dark:text-slate-100">
                    <span className="font-medium">{p.name}</span> has{" "}
                    <span className="font-medium text-orange-500">
                      {p.remaining} bottles
                    </span>{" "}
                    remaining
                  </p>
                  <p className="text-xs text-gray-400 mt-1 dark:text-slate-400">Low stock alert</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const { authUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-500 dark:text-slate-400">Loading...</p>
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
      <div className="flex h-screen w-full bg-gray-50 relative dark:bg-slate-900">
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
            className="absolute top-4 left-4 text-green-800 text-2xl z-30 dark:text-green-400"
          >
            <FiMenu />
          </button>
        )}

        <div className="min-w-0 flex-1 overflow-y-auto">
          <header
            className={`sticky top-0 z-10 flex h-20 shrink-0 items-center justify-end gap-0.5 bg-gray-50 sm:gap-2 md:z-30 dark:bg-slate-900 ${
              sidebarOpen
                ? "mt-8 max-md:ml-64 max-md:mr-1 md:mx-6"
                : "mx-2 mt-8 md:mx-10"
            }`}
          >
            <NotificationBell />
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className={`relative z-30 ${headerButtonClass}`}
            >
              {theme === "dark" ? (
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
              <CircleUserRound
                size={22}
                className="shrink-0"
                aria-hidden="true"
              />
              <span className="min-w-0 truncate text-sm font-medium leading-tight">
                {fullName}
              </span>
            </button>
          </header>

          <div
            className={`bg-white rounded-2xl shadow-md p-6 min-h-screen dark:bg-slate-800 dark:text-slate-100 ${
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
