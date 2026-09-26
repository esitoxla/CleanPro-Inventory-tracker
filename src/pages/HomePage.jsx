import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { InventoryContext } from "../context/InventoryContext";
import { AuthContext } from "../context/authContext";
import { ProductContext } from "../context/ProductsContext";
import { useTheme } from "../context/themeContext";
import { productTextColors } from "../helpers/colorMap";
import { getProductColor } from "../utils/productColor";



export default function HomePage() {
  const [activeTab, setActiveTab] = useState("expenses");
  const [expensesSummary, setExpensesSummary] = useState([]);
  const [overallTotal, setOverallTotal] = useState(0);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { changePassword } = useContext(AuthContext);
  const { products } = useContext(ProductContext);
  const { theme } = useTheme();
  const { expenseSummary, totalExpenses, fetchExpenseSummary } =
    useContext(InventoryContext);

  // Fetch total expenses by product
  useEffect(() => {
    fetchExpenseSummary();
  }, []);

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword)
      return toast.error("New passwords do not match");

    try {
      await changePassword({ oldPassword, newPassword, confirmPassword }); // call from context
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#223962] mb-6 dark:text-slate-100">Summary/Settings</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-300 lg:w-[30%] md:w-[60%] w-full mb-6 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("expenses")}
          className={`pb-2 font-semibold transition-all ${
            activeTab === "expenses"
              ? "text-cyan-600 border-b-2 border-cyan-600"
              : "text-gray-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
          }`}
        >
          Expense Summary
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`pb-2 font-semibold transition-all ${
            activeTab === "password"
              ? "text-cyan-600 border-b-2 border-cyan-600"
              : "text-gray-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Expense Summary Section */}
      {activeTab === "expenses" && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-700 mb-4 dark:text-slate-100">
            Overall Expense Summary
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-100">
                <th className="text-left p-2">Product</th>
                <th className="text-right p-2">Total (₵)</th>
              </tr>
            </thead>
            <tbody>
              {expenseSummary.map((item, index) => {
                const matchedProduct = products.find(
                  (product) => product.name === item.product,
                );
                const brandColor = matchedProduct?.color
                  ? getProductColor(matchedProduct.color, theme)
                  : null;

                return (
                <tr key={index} className="border-t dark:border-slate-700">
                  <td
                    className={`p-2 font-semibold ${
                      brandColor
                        ? ""
                        : productTextColors[item.product] ||
                          "text-gray-700 dark:text-slate-100"
                    }`}
                    style={brandColor ? { color: brandColor } : undefined}
                  >
                    {item.product}
                  </td>
                  <td className="p-2 text-right text-purple-700 font-semibold dark:text-purple-300">
                    {item.total.toFixed(2)}
                  </td>
                </tr>
                );
              })}
              <tr className="font-bold border-t bg-gray-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                <td className="p-2">Overall Total</td>
                <td className="p-2 text-right text-purple-700 dark:text-purple-300">
                  ₵{totalExpenses}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Change Password Section */}
      {activeTab === "password" && (
        <div className="flex flex-col md:flex-row gap-4 w-full bg-white dark:bg-transparent">
          <div className="md:w-1/3 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-slate-100">
              Change Passcode
            </h2>

            <p className="text-gray-600 dark:text-slate-400">
              Enter a new passcode to reset old one
            </p>
          </div>

          <div className="bg-white border border-cyan-600 shadow-xs p-6 rounded-md md:w-2/3 dark:bg-slate-800 dark:border-cyan-500">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleChangePassword}
            >
              <div>
                <label className="block text-gray-600 mb-1 font-medium dark:text-slate-400">
                  Old Passcode
                </label>
                <input
                  type="password"
                  placeholder="Enter old passcode"
                  className="border border-gray-200 p-3 rounded-lg w-full bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium dark:text-slate-400">
                  New Passcode
                </label>
                <input
                  type="password"
                  placeholder="Enter new passcode"
                  className="border border-gray-200 p-3 rounded-lg w-full bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-medium dark:text-slate-400">
                  Confirm New Passcode
                </label>
                <input
                  type="password"
                  placeholder="Confirm new passcode"
                  className="border border-gray-200 p-3 rounded-lg w-full bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all lg:w-[30%] md:w-[60%] w-full"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
