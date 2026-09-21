import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { MdClose } from "react-icons/md";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import toast from "react-hot-toast";

const SidebarAccount = ({ toggleSidebar }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Logout successful");
  };

  return (
    <div className="h-screen w-64 bg-gray-100 shadow-[8px_0_24px_-8px_rgba(0,0,0,0.15)] flex flex-col pt-8">
      <div className="md:hidden flex justify-end pr-4">
        <button onClick={toggleSidebar} className="text-2xl">
          <MdClose />
        </button>
      </div>

      <div className="flex gap-1 pl-6 py-6 text-2xl font-bold text-gray-700 pb-6 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)]">
        <div>
          <span className="text-pink-500">Kora</span>
          <span className="text-cyan-500">Wo</span>
        </div>
        <span className="text-green-500">Adwuma</span>
      </div>

      <div className="flex-1 mt-6">
        <NavLink to="/dashboard" end>
          {({ isActive }) => (
            <div
              className={`px-5 py-3 m-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? "bg-cyan-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Manage Products
            </div>
          )}
        </NavLink>

        <NavLink to="/dashboard/home">
          {({ isActive }) => (
            <div
              className={`px-5 py-3 m-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? "bg-cyan-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Summary/Settings
            </div>
          )}
        </NavLink>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 mx-3 mb-4 px-4 py-3
       text-red-500 bg-red-50 hover:bg-red-100 rounded-xl font-semibold
       border border-red-100 shadow-sm
       transition-all duration-300 ease-in-out cursor-pointer"
      >
        <LogOut size={18} className="text-red-500" />
        <span>Leave</span>
      </button>

      <div className="text-center py-3 text-sm text-gray-700 mt-2 shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.1)]">
        © 2025 KoraWo Adwuma
      </div>
    </div>
  );
};

export default SidebarAccount;
