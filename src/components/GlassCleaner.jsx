import React from "react";
import { FaMicrophone } from "react-icons/fa";
import { useState, useContext } from "react";
import AddProductiveVoice from "./AddProductiveVoice";
import { InventoryContext } from "../context/InventoryContext";
import { IoTrashOutline } from "react-icons/io5";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import toast from "react-hot-toast";
import { FaUndoAlt } from "react-icons/fa";

export default function GlassCleaner() {
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [actionType, setActionType] = useState(""); // to know if it's for production, sales, or expense
  const { products, productions, sales, expenses, deleteExpense, deleteLatestRecord, addRecord, loading } =
    useContext(InventoryContext);

  //find the product record from your products array
  const glassCleaner = products.find(
    (p) => p.name?.toLowerCase() === "glass cleaner"
  );

  if (loading) return <p>Loading...</p>;
  if (!glassCleaner) return <p>Glass Cleaner not found.</p>;

  //use that to filter records for only glass cleaner
  const glassProductions = productions.filter(
    (p) => p.productId === glassCleaner?.id
  );

  const glassSales = sales.filter((s) => s.productId === glassCleaner?.id);

  const glassExpenses = expenses.filter(
    (e) => e.productId === glassCleaner?.id
  );

  //Compute Totals from the Fetched Data
  const totalProduced = glassProductions.reduce((a, b) => a + b.quantity, 0);
  const totalSales = glassSales.reduce((a, b) => a + b.quantity, 0);
  const totalRemaining = Math.max(totalProduced - totalSales, 0);
  const totalExpense = glassExpenses
    .reduce((a, b) => a + Number(b.amount || 0), 0)
    .toFixed(2);


  const handleVoiceResult = async (text) => {
   const lower = text.toLowerCase();
   const match = lower.match(/\d+/);
   const amount = match ? parseInt(match[0]) : 0;

   if (!amount) {
     toast.error("Couldn't detect a number. Please try again.");
     return;
   }

    if (actionType === "production") {
     if (lower.includes("produce") || lower.includes("produced")) {
       try {
         await addRecord("production", {
           productId: glassCleaner.id,
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
      setActionType(" ");
    }

    if (actionType === "sales") {
     if (lower.includes("sell") || lower.includes("sold")) {
       // Check that sale doesn’t exceed available stock
       if (amount > totalRemaining) {
         toast.error("Sales can not be more than production!");
         return;
       }
       try {
         await addRecord("sales", {
           productId: glassCleaner.id,
           quantity: amount,
         });
       } catch (error) {
         console.error("Error adding production:", error);
         toast.error("Something went wrong while adding production.");
       }
     } else {
       // Handle when phrase doesn't mention production
       toast.error("Couldn't detect a sales command.");
     }
      setShowVoiceModal(false);
    }
    setActionType("");

    if (actionType === "expense") {
     const description =
       lower.replace(/₵?\s?\d+/g, "").trim() || "Unnamed Expense";
     await addRecord("expenses", {
       productId: glassCleaner.id,
       description,
       amount,
     });
    }
    setActionType("");
  };

  

  const maxValue = Math.max(totalProduced, totalSales, totalRemaining, 1); // avoid division by zero
  const producedWidth = (totalProduced / maxValue) * 100;
  const salesWidth = (totalSales / maxValue) * 100;
  const remainingWidth = (totalRemaining / maxValue) * 100;

  const handleDelete = (expenseId, amount) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-2">
        <span className="font-medium text-gray-700">Delete this expense?</span>
        <div className="flex gap-3">
          <button
            onClick={() => {
              deleteExpense(glassCleaner.id, expenseId);
              toast.dismiss(t.id); // Close toast
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center justify-between bg-cyan-400 text-white px-6 py-4 rounded-xl shadow-md">
        <h1 className="md:text-2xl text-[1.3rem] font-bold">
          Glass Cleaner Dashboard
        </h1>
        <p className="text-md italic">Track your production and sales easily</p>
      </div>

      {/* Stock Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 text-gray-800 rounded-xl p-4 shadow relative">
          <h2 className="font-bold text-lg">Produced</h2>
          <p className="text-3xl font-extrabold text-green-600 mt-2">
            {totalProduced}
          </p>
          <p className="text-sm text-gray-500">bottles</p>

          <button
            onClick={() => deleteLatestRecord("production", glassCleaner.id)}
            className="absolute top-4 right-4 text-green-500 hover:text-green-700"
            title="Undo last production"
          >
            <span>
              <FaUndoAlt />
            </span>
          </button>
        </div>
        <div className="bg-blue-100 text-gray-800 rounded-xl p-4 shadow relative">
          <h2 className="font-bold text-lg">Sold</h2>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">
            {totalSales}
          </p>
          <p className="text-sm text-gray-500">bottles</p>

          {/* Undo button (top-right corner) */}
          <button
            onClick={() => deleteLatestRecord("sales", glassCleaner.id)}
            className="absolute top-4 right-4 text-blue-500 hover:text-blue-700"
            title="Undo last sales"
          >
            <span>
              <FaUndoAlt />
            </span>
          </button>
        </div>
        <div className="bg-yellow-100 text-gray-800 rounded-xl p-4 shadow">
          <h2 className="font-bold text-lg">Remaining</h2>
          <p className="text-3xl font-extrabold text-yellow-600 mt-2">
            {totalRemaining}
          </p>
          <p className="text-sm text-gray-500">bottles</p>
        </div>
      </div>

      {/* Voice Action Buttons */}
      <div className="flex flex-wrap gap-4 font-semibold">
        <button
          onClick={() => {
            setActionType("production");
            setShowVoiceModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaMicrophone /> Add Production
        </button>

        <button
          onClick={() => {
            setActionType("sales");
            setShowVoiceModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaMicrophone /> Record Sales
        </button>

        <button
          onClick={() => {
            setActionType("expense");
            setShowVoiceModal(true);
          }}
          className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaMicrophone /> Add Expense
        </button>
      </div>

      {/* Show the Voice Modal when active */}
      {showVoiceModal && (
        <AddProductiveVoice
          onClose={() => setShowVoiceModal(false)}
          onResult={handleVoiceResult}
        />
      )}

      {/* Expenses Section */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="font-bold text-lg mb-3 text-gray-700">
          Recent Expenses
        </h2>
        {/* Table Wrapper */}
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Amount (₵)</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Remove</th>
            </tr>
          </thead>

          <tbody>
            {glassExpenses.length > 0 ? (
              glassExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b transition-all duration-200"
                >
                  {/* Item */}
                  <td className="px-4 py-3 capitalize">
                    {expense.description}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 font-semibold text-cyan-700">
                    {expense.amount}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-500">
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
                      onClick={() => handleDelete(expense.id, expense.amount)}
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
                  className="text-center text-gray-500 py-4 italic"
                >
                  No expenses recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total Expense Summary */}
        <div className="mt-4 flex items-center justify-between font-semibold text-gray-800 pt-3 w-full">
          <span className="">Total Expenses:</span>

          <span className="text-cyan-700 text-md md:w-[70%] w-[50%]">
            {totalExpense}
          </span>
        </div>
      </div>

      {/* Simple Bar Chart (visual summary) */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="font-bold text-lg mb-4 text-gray-700">
          Weekly Activities
        </h2>

        <div className="space-y-4">
          {/* Produced */}
          <div>
            <p className="text-sm text-gray-600">Produced</p>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div
                className="bg-green-500 h-5 rounded-full transition-all duration-500"
                style={{ width: `${producedWidth}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalProduced} bottles
            </p>
          </div>

          {/* Sold */}
          <div>
            <p className="text-sm text-gray-600">Sold</p>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div
                className="bg-blue-500 h-5 rounded-full transition-all duration-500"
                style={{ width: `${salesWidth}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{totalSales} bottles</p>
          </div>

          {/* Remaining */}
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div
                className="bg-yellow-400 h-5 rounded-full transition-all duration-500"
                style={{ width: `${remainingWidth}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalRemaining} bottles
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>{" "}
              Produced
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Sold
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>{" "}
              Remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
