import {
  FaSoap,
  FaPumpSoap,
  FaSprayCan,
  FaGlassWhiskey,
  FaTint,
} from "react-icons/fa";
import { LogOut } from "lucide-react";
import { NavLink } from "react-router";
import { MdClose } from "react-icons/md";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const products = [
  {
    name: "Liquid Soap",
    to: "/dashboard",
    color: "bg-green-500",
    icon: <FaPumpSoap />,
  },
  {
    name: "Floor Cleaner",
    to: "/dashboard/floor",
    color: "bg-blue-500",
    icon: <FaSoap />,
  },
  {
    name: "Bleach",
    to: "/dashboard/bleach",
    color: "bg-yellow-400",
    icon: <FaTint />,
  },
  {
    name: "Glass Cleaner",
    to: "/dashboard/glass",
    color: "bg-cyan-400",
    icon: <FaGlassWhiskey />,
  },
  {
    name: "Softener",
    to: "/dashboard/softener",
    color: "bg-pink-500",
    icon: <FaSprayCan />,
  },
];

const Sidebar = ({ toggleSidebar }) => {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); 
    toast.success("Logout successful")
  };



  return (
    <div className="h-screen w-64 bg-gray-100 border-r shadow-lg flex flex-col pt-8">
      {/* Close button (mobile only) */}
      <div className="md:hidden flex justify-end pr-4">
        <button onClick={toggleSidebar} className="text-2xl">
          <MdClose />
        </button>
      </div>

      {/* Logo Section */}
      <div className="flex gap-1 pl-6  py-6 text-2xl font-bold text-gray-700 border-b">
        <div>
          <span className="text-pink-500"> Clean</span>
          <span className="text-cyan-500">Pro</span>
        </div>
        <span className="text-green-500">Tracker</span>
      </div>

      {/* Product Links */}
      <div className="flex-1 overflow-y-auto mt-6">
        {products.map((product, index) => (
          <NavLink
            key={index}
            to={`${product.to}`}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 m-3 rounded-xl cursor-pointer font-medium text-white transition-all duration-200 shadow-md
              ${product.color} 
              hover:scale-105 hover:shadow-lg 
              ${isActive ? "ring-2 ring-offset-2 ring-gray-300" : ""}`
            }
          >
            <span className="text-xl">{product.icon}</span>
            <span>{product.name}</span>
          </NavLink>
        ))}
      </div>

      <button
      onClick={handleLogout}
        className="flex items-center gap-2 w-full px-4 py-2 mt-4 text-red-500
             bg-red-50 hover:bg-red-100 rounded-lg font-semibold 
             transition-all duration-300 ease-in-out cursor-pointer"
      >
        <LogOut size={18} className="text-red-500" />
        <span>Log Out</span>
      </button>

      {/* Footer */}
      <div className="text-center py-3 text-sm text-gray-700 border-t">
        © 2025 CleanPro Tracker
      </div>
    </div>
  )
}

export default Sidebar;
