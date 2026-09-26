import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../config/axios";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { authUser } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  //  Fetch all productions
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");

      setExpenses(res.data.data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses data");
    } finally {
      setLoading(false);
    }
  };

  // Add production
  const addExpense = async (payload) => {
    try {
      const res = await api.post("/expenses", payload);

      // Optimistic update (add to top)
      setExpenses((prev) => [res.data.data, ...prev]);

      toast.success("Expenses recorded");
    } catch (error) {
      console.error("Error adding expenses:", error);
      toast.error("Failed to add expenses");
    }
  };

  // Delete a specific expense
  const deleteExpense = async (productId, expenseId) => {
    try {
      await api.delete(`/expenses/${productId}/${expenseId}`);

      // Remove it from the local state
      setExpenses((prev) =>
        prev.filter((expense) => expense && expense.id !== expenseId),
      );

      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  // Delete latest production (undo)
  const deleteLatestExpense = async (productId) => {
    try {
      await api.delete(`/expenses/latest/${productId}`);

      // Option 1 (safe): refetch
      await fetchExpenses();

      toast.success("Last expenses removed");
    } catch (error) {
      console.error("Error deleting expenses:", error);
      toast.error("Failed to undo expenses");
    }
  };

  //  Auto-fetch when user logs in
  useEffect(() => {
    if (authUser) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [authUser]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        fetchExpenses,
        addExpense,
        deleteExpense,
        deleteLatestExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};;
