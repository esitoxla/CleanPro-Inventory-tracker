import React from "react";
import { createContext, useState, useEffect } from "react";
import { api } from "../config/axios";
import toast from "react-hot-toast";

export const InventoryContext = createContext();

export default function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productions, setProductions] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch all products on load
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch production, sales, and expenses data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, salesRes, expRes] = await Promise.all([
        api.get("/productions"),
        api.get("/sales"),
        api.get("/expenses"),
      ]);
      setProductions(prodRes.data.data || []);
      setSales(salesRes.data.data || []);
      setExpenses(expRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseSummary = async () => {
    try {
      const res = await api.get("/expenses/summary");
      if (res.data.success) {
        setExpenseSummary(res.data.data);
        setTotalExpenses(res.data.total);
      }
    } catch (error) {
      console.error("Error fetching expense summary:", error);
      toast.error("Failed to load expense summary");
    }
  };

  // addRecord function
  const addRecord = async (type, payload) => {
    try {
      // Handle singular/plural route mapping
      let endpoint = `/${type}`;
      if (type === "production") endpoint = "/productions";
      if (type === "sales") endpoint = "/sales";
      if (type === "expenses") endpoint = "/expenses";

      // Make the request
      await api.post(endpoint, payload);
      await fetchAllData(); // refresh data after adding

      console.log(`${type} record added successfully.`);
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
    }
  };

  //Delete a specific expense for a given product
  const deleteExpense = async (productId, id) => {
    try {
      await api.delete(`/expenses/${productId}/${id}`);

      // Remove from local state immediately (optimistic update)
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));

      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  // Delete the most recent record (production/sales)
  const deleteLatestRecord = async (type, productId) => {
    try {
      const route =
        type === "sales"
          ? "sales"
          : type === "production"
          ? "productions"
          : null;
      await api.delete(`/${route}/latest/${productId}`);
      await fetchAllData(); // refresh dashboard data
      toast.success(`Last ${type} record removed successfully.`);
    } catch (error) {
      console.error(`Error deleting latest ${type}:`, error);
      toast.error(`Failed to undo last ${type}.`);
    }
  };

  // Fetch everything when the app loads
  useEffect(() => {
    fetchProducts();
    fetchAllData();
    fetchExpenseSummary();
  }, []);
  return (
    <InventoryContext.Provider
      value={{
        products,
        productions,
        sales,
        expenses,
        expenseSummary,
        totalExpenses,
        loading,
        fetchProducts,
        fetchAllData,
        fetchExpenseSummary,
        addRecord,
        deleteExpense,
        deleteLatestRecord,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
