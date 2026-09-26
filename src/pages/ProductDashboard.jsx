import React from "react";
import { FaMicrophone } from "react-icons/fa";
import AddProductiveVoice from "../components/AddProductiveVoice";
import { useState, useContext } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import toast from "react-hot-toast";
import { FaUndoAlt } from "react-icons/fa";
import { ProductContext } from "../context/ProductsContext";
import { ProductionContext } from "../context/ProductionsContext";
import { SalesContext } from "../context/SalesContext";
import { ExpenseContext } from "../context/ExpenseContext";
import { useTheme } from "../context/themeContext";
import { getProductColor } from "../utils/productColor";

export default function ProductDashboard() {
    const [showVoiceModal, setShowVoiceModal] = useState(false);
      const [recognizedText, setRecognizedText] = useState("");
      const [actionType, setActionType] = useState(""); // to know if it's for production, sales, or expense
    
      const { products, selectedProduct } = useContext(ProductContext);
    
      const {
        productions,
        addProduction,
        deleteLatestProduction,
        loading: productionLoading,
      } = useContext(ProductionContext);
    
      const { sales, addSales, deleteLatestSales } = useContext(SalesContext);
    
      const { expenses, addExpense, deleteExpense, deleteLatestExpense } =
        useContext(ExpenseContext);
      const { theme } = useTheme();
    
      const currentProduct = selectedProduct;
    
      if (productionLoading) return <p className="text-gray-500 dark:text-slate-400">Loading...</p>;
      if (!currentProduct) return <p className="text-gray-500 dark:text-slate-400">No product selected.</p>;

      const brandColor = getProductColor(
        currentProduct.color || "#22c55e",
        theme,
      );

    
    
      const soapProductions = (productions || []).filter(
        (p) => p && p.productId === currentProduct.id,
      );

      
      const soapSales = (sales || []).filter(
        (s) => s && s.productId === currentProduct.id,
      );

      const soapExpenses = (expenses || []).filter(
        (e) => e && e.productId === currentProduct.id,
      );
    
      //Compute Totals from the Fetched Data
      const totalProduced = soapProductions.reduce((a, b) => a + b.quantity, 0);
      const totalSales = soapSales.reduce((a, b) => a + b.quantity, 0);
      const totalRemaining = Math.max(totalProduced - totalSales, 0);
    
      //The .reduce() function is used to sum all the amounts.
      const totalExpense = soapExpenses
        .reduce((a, b) => a + Number(b.amount || 0), 0)
        .toFixed(2);
    
      const handleVoiceResult = async (text) => {
        const lower = text.toLowerCase();
    
        //trying to extract the number (10) to update your production count.
        //This uses a regular expression (regex) / / to search for one or more digits in the string.
        // \d → any digit (0–9) + one or more of those digits in a row
        const match = lower.match(/\d+/);
        const amount = match ? parseInt(match[0]) : 0;
    
        //handle match and lower error
    
        if (!amount) {
          toast.error("Couldn't detect a number. Please try again.");
          return;
        }
        //Production
        if (actionType === "production") {
          // Check if it's a production-related phrase
          if (lower.includes("produce") || lower.includes("produced")) {
            try {
              await addProduction({
                productId: currentProduct.id,
                quantity: amount,
              });
            } catch (error) {
              console.error("Error adding production:", error);
              toast.error("Something went wrong while adding production.");
            }
          } else {
            // Handle when phrase doesn't mention production
            toast.error("Couldn't detect a production command.");
          }
          setShowVoiceModal(false);
        }
        setActionType(""); // reset
    
        //SALES
        if (actionType === "sales") {
          // Check if it's a sales-related phrase
          if (lower.includes("sell") || lower.includes("sold")) {
            // Check that sale doesn’t exceed available stock
            if (amount > totalRemaining) {
              toast.error("Sales can not be more than production!");
              return;
            }
            try {
              await addSales({
                productId: currentProduct.id,
                quantity: amount,
              });
            } catch (error) {
              console.error("Error adding sales:", error);
              toast.error("Something went wrong while adding sales.");
            }
          } else {
            // Handle when phrase doesn't mention production
            toast.error("Couldn't detect a sales command!");
          }
          setShowVoiceModal(false);
        }
        setActionType(""); // reset
    
        // EXPENSE
        if (actionType === "expense") {
          const description =
            lower.replace(/₵?\s?\d+/g, "").trim() || "Unnamed Expense";
          await addExpense({
            productId: currentProduct.id,
            description,
            amount,
          });
          setActionType(""); // reset
        }
        setShowVoiceModal(false);
      };
    
      const maxValue = Math.max(totalProduced, totalSales, totalRemaining, 1); // avoid division by zero
      const producedWidth = (totalProduced / maxValue) * 100;
      const salesWidth = (totalSales / maxValue) * 100;
      const remainingWidth = (totalRemaining / maxValue) * 100;
    
      const handleDelete = (expenseId, amount) => {
        toast((t) => (
          <div className="flex flex-col items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-slate-100">Delete this expense?</span>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  deleteExpense(currentProduct.id, expenseId);
                  toast.dismiss(t.id); // Close toast
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              >
                No
              </button>
            </div>
          </div>
        ));
      };
    
      return (
        <div className="space-y-6">
          {/* Header */}
          <div
            className="rounded-xl p-4 flex justify-between items-center bg-white border-2 shadow-sm dark:bg-slate-800"
            style={{
              borderColor: brandColor,
            }}
          >
            <h1
              className="md:text-2xl text-[1.4rem] font-extrabold"
              style={{ color: brandColor }}
            >
              {currentProduct?.name}
            </h1>

            <p className="text-gray-500 italic dark:text-slate-400">
              Track your production and sales easily
            </p>
          </div>

          {/* Stock Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4 shadow relative border-l-4 border-zinc-600 dark:bg-slate-800 dark:border-zinc-400">
              <h2 className="font-bold text-lg text-gray-700 dark:text-slate-100">Produced</h2>
              <p className="text-3xl font-extrabold text-zinc-700 mt-2 dark:text-zinc-200">
                {totalProduced}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">bottles</p>

              <button
                onClick={() => deleteLatestProduction(currentProduct.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-zinc-700 dark:text-slate-400 dark:hover:text-zinc-200"
                title="Undo last production"
              >
                <span>
                  <FaUndoAlt />
                </span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow relative border-l-4 border-indigo-900 dark:bg-slate-800 dark:border-indigo-400">
              <h2 className="font-bold text-lg text-gray-700 dark:text-slate-100">Sold</h2>
              <p className="text-3xl font-extrabold text-indigo-900 mt-2 dark:text-indigo-300">
                {totalSales}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">bottles</p>

              <button
                onClick={() => deleteLatestSales(currentProduct.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-indigo-700 dark:text-slate-400 dark:hover:text-indigo-300"
                title="Undo last sales"
              >
                <span>
                  <FaUndoAlt />
                </span>
              </button>
            </div>

            <div
              className={`bg-white rounded-xl p-4 shadow border-l-4 dark:bg-slate-800 ${
                totalRemaining === 0
                  ? "border-red-500"
                  : totalRemaining < 10
                    ? "border-amber-500"
                    : "border-teal-700 dark:border-teal-400"
              }`}
            >
              <h2 className="font-bold text-lg text-gray-700 dark:text-slate-100">Remaining</h2>
              <p
                className={`text-3xl font-extrabold mt-2 ${
                  totalRemaining === 0
                    ? "text-red-600 dark:text-red-400"
                    : totalRemaining < 10
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-teal-700 dark:text-teal-300"
                }`}
              >
                {totalRemaining}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">bottles</p>
            </div>
          </div>

          {/* Voice Action Buttons */}
          <div className="flex flex-wrap gap-4 font-semibold">
            <button
              onClick={() => {
                setActionType("production");
                setShowVoiceModal(true);
              }}
              className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg shadow transition dark:bg-slate-600 dark:hover:bg-slate-500"
            >
              <FaMicrophone /> Add Production
            </button>
            <button
              onClick={() => {
                setActionType("sales");
                setShowVoiceModal(true);
              }}
              className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <FaMicrophone /> Record Sales
            </button>
            <button
              onClick={() => {
                setActionType("expense");
                setShowVoiceModal(true);
              }}
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <FaMicrophone /> Add Expense
            </button>
          </div>

          {/* Show recognized voice text
          {recognizedText && (
            <div className="bg-white p-3 rounded-lg shadow-md">
              <p className="text-gray-700 italic">You said: “{recognizedText}”</p>
            </div>
          )} */}

          {/* Show the Voice Modal when active */}
          {showVoiceModal && (
            <AddProductiveVoice
              onClose={() => setShowVoiceModal(false)}
              onResult={handleVoiceResult}
            />
          )}

          {/* Expenses Section */}
          <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto dark:bg-slate-800 dark:ring-1 dark:ring-slate-700">
            <h2 className="font-bold text-lg mb-4 text-gray-700 dark:text-slate-100">
              Recent Expenses
            </h2>

            {/* Table Wrapper */}
            <table className="w-full text-sm text-left text-gray-700 border-collapse dark:text-slate-100">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b dark:bg-slate-700 dark:text-slate-400 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Amount (₵)</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-center">Remove</th>
                </tr>
              </thead>

              <tbody>
                {soapExpenses.length > 0 ? (
                  soapExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b transition-all duration-200 dark:border-slate-700"
                    >
                      {/* Item */}
                      <td className="px-4 py-3 capitalize">
                        {expense.description}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-semibold text-purple-700 dark:text-purple-300">
                        {expense.amount}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-500 dark:text-slate-400">
                        {(() => {
                          const date = new Date(expense.createdAt);

                          if (isToday(date)) return "Today";
                          if (isYesterday(date)) return "Yesterday";
                          if (isThisWeek(date)) return format(date, "EEEE"); // e.g. Monday
                          return format(date, "EEE, d MMM yyyy"); // e.g. Mon, 21 Oct 2025
                        })()}
                      </td>

                      {/* Delete Action */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            handleDelete(expense.id, expense.amount)
                          }
                          className="text-red-500 hover:text-red-700 text-lg transition-all"
                        >
                          <IoTrashOutline />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-gray-500 py-4 italic dark:text-slate-400"
                    >
                      No expenses recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Total Expense Summary */}
            <div className="mt-4 flex items-center justify-between font-semibold text-gray-800 pt-3 w-full dark:text-slate-100 dark:border-t dark:border-slate-700">
              <span className="">Total Expenses:</span>

              <span className="text-purple-700 text-md md:w-[77%] w-[50%] dark:text-purple-300">
                {totalExpense}
              </span>
            </div>
          </div>

          {/* Simple Bar Chart (visual summary) */}
          <div className="bg-white p-4 rounded-xl shadow-md dark:bg-slate-800 dark:ring-1 dark:ring-slate-700">
            <h2 className="font-bold text-lg mb-4 text-gray-700 dark:text-slate-100">
              Weekly Activities
            </h2>
            <div className="space-y-4">
              {/* Produced */}
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Produced</p>
                <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-slate-700">
                  <div
                    className="bg-zinc-600 h-5 rounded-full transition-all duration-500 dark:bg-zinc-400"
                    style={{ width: `${producedWidth}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                  {totalProduced} bottles
                </p>
              </div>

              {/* Sold */}
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Sold</p>
                <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-slate-700">
                  <div
                    className="bg-indigo-900 h-5 rounded-full transition-all duration-500 dark:bg-indigo-400"
                    style={{ width: `${salesWidth}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                  {totalSales} bottles
                </p>
              </div>

              {/* Remaining */}
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Remaining</p>
                <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-slate-700">
                  <div
                    className={`h-5 rounded-full transition-all duration-500 ${
                      totalRemaining === 0
                        ? "bg-red-500"
                        : totalRemaining < 10
                          ? "bg-amber-500"
                          : "bg-teal-700 dark:bg-teal-400"
                    }`}
                    style={{ width: `${remainingWidth}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                  {totalRemaining} bottles
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-zinc-600 rounded-full dark:bg-zinc-400"></span>
                  Produced
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-indigo-900 rounded-full dark:bg-indigo-400"></span>{" "}
                  Sold
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      totalRemaining === 0
                        ? "bg-red-500"
                        : totalRemaining < 10
                          ? "bg-amber-500"
                          : "bg-teal-700 dark:bg-teal-400"
                    }`}
                  ></span>
                  Remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
}
