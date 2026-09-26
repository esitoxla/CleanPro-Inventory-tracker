import { LogOut, ArrowLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { MdClose } from "react-icons/md";
import { AuthContext } from "../context/authContext";
import { ProductContext } from "../context/ProductsContext";
import { useContext } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../context/themeContext";

const SidebarWorkspace = ({ toggleSidebar }) => {
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
    <div className="h-screen w-64 bg-gray-100 shadow-[8px_0_24px_-8px_rgba(0,0,0,0.15)] flex flex-col pt-8 dark:bg-slate-800 dark:shadow-[8px_0_24px_-8px_rgba(0,0,0,0.45)]">
      <div className="md:hidden flex justify-end pr-4">
        <button onClick={toggleSidebar} className="text-2xl text-gray-700 dark:text-slate-100">
          <MdClose />
        </button>
      </div>

      <div className="flex gap-1 pl-6 py-6 text-2xl font-bold text-gray-700 pb-6 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] dark:text-slate-100 dark:shadow-[0_4px_12px_-6px_rgba(0,0,0,0.45)]">
        <div>
          <span className="text-pink-500">Kora</span>
          <span className="text-cyan-500">Wo</span>
        </div>
        <span className="text-green-500">Adwuma</span>
      </div>

      <NavLink to="/dashboard" end>
        <div className="flex items-center gap-2 px-5 py-3 m-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 transition-all dark:text-slate-100 dark:hover:bg-slate-700">
          <ArrowLeft size={16} />
          <span>Manage Products</span>
        </div>
      </NavLink>

      <div className="flex-1 overflow-y-auto mt-2">
        {products.map((product) => (
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

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 mx-3 mb-4 px-4 py-3
       text-red-500 bg-red-50 hover:bg-red-100 rounded-xl font-semibold
       border border-red-100 shadow-sm
       transition-all duration-300 ease-in-out cursor-pointer
       dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/40 dark:hover:bg-red-950/50"
      >
        <LogOut size={18} className="text-red-500 dark:text-red-400" />
        <span>Leave</span>
      </button>

      <div className="text-center py-3 text-sm text-gray-700 mt-2 shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.1)] dark:text-slate-400 dark:shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.45)]">
        © 2025 KoraWo Adwuma
      </div>
    </div>
  );
};

export default SidebarWorkspace;
