import {
  FaSoap,
  FaPumpSoap,
  FaSprayCan,
  FaGlassWhiskey,
  FaTint,
} from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { LogOut } from "lucide-react";
import { NavLink } from "react-router";
import { MdClose } from "react-icons/md";
import { AuthContext } from "../context/authContext";
import { ProductContext } from "../context/ProductsContext";
import { useContext } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useTheme } from "../context/themeContext";


const Sidebar = ({ toggleSidebar }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { products, selectedProduct, setSelectedProduct } =
    useContext(ProductContext);
  const { theme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    toast.success("Logout successful");
  };

  return (
    <div className="h-screen w-64 bg-gray-100 border-r shadow-lg flex flex-col pt-8 dark:bg-slate-800 dark:border-slate-700">
      {/* Close button (mobile only) */}
      <div className="md:hidden flex justify-end pr-4">
        <button onClick={toggleSidebar} className="text-2xl text-gray-700 dark:text-slate-100">
          <MdClose />
        </button>
      </div>

      {/* Logo Section */}
      <div className="flex gap-1 pl-6  py-6 text-2xl font-bold text-gray-700 border-b dark:text-slate-100 dark:border-slate-700">
        <div>
          <span className="text-pink-500"> Clean</span>
          <span className="text-cyan-500">Pro</span>
        </div>
        <span className="text-green-500">Tracker</span>
      </div>

      <NavLink to="/dashboard" end>
        <div className="px-5 py-2 font-semibold text-[#223962] w-full cursor-pointer flex items-center gap-2 bg-blue-200 dark:bg-slate-700 dark:text-slate-100">
          <span className="text-center text-[1.2rem]">Manage Products</span>
        </div>
      </NavLink>

      {/* Product Links */}
      <div className="flex-1 overflow-y-auto mt-6">
        {products.map((product, index) => (
          <NavLink
            key={product.id}
            to="/dashboard/workspace"
            onClick={() => setSelectedProduct(product)}
            style={{
              backgroundColor:
                selectedProduct?.id === product.id
                  ? product.color
                  : theme === "dark"
                    ? "#1E293B"
                    : "#ffffff",
              color:
                selectedProduct?.id === product.id
                  ? "#ffffff"
                  : theme === "dark"
                    ? "#F1F5F9"
                    : "#374151",
              border:
                selectedProduct?.id === product.id
                  ? `2px solid ${product.color}`
                  : theme === "dark"
                    ? "2px solid #334155"
                    : "2px solid #e5e7eb",
            }}
            className="flex items-center gap-3 px-5 py-3 m-3 rounded-xl font-medium
             shadow-md transition-all duration-300 hover:scale-105"
          >
            <span>{product.name}</span>
          </NavLink>
        ))}
      </div>

      <NavLink to="/dashboard/home">
        <div className="px-5 py-2 font-semibold text-[#223962] w-full cursor-pointer flex items-center gap-2 bg-blue-200 dark:bg-slate-700 dark:text-slate-100">
          <span className="text-center text-[1.2rem]">Summary/Settings</span>
        </div>
      </NavLink>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-4 py-2 text-red-500
             bg-red-50 hover:bg-red-100 rounded-lg font-semibold 
             transition-all duration-300 ease-in-out cursor-pointer
             dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/50"
      >
        <LogOut size={18} className="text-red-500 dark:text-red-400" />
        <span>Leave</span>
      </button>

      {/* Footer */}
      <div className="text-center py-3 text-sm text-gray-700 border-t dark:text-slate-400 dark:border-slate-700">
        © 2025 CleanPro Tracker
      </div>
    </div>
  );
};

export default Sidebar;
