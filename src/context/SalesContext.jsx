import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../config/axios";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const { authUser } = useContext(AuthContext);

   const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  //  Fetch all productions
  const fetchAllSales = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sales");

      setSales(res.data.data || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  // Add 
  const addSales = async (payload) => {
    try {
      const res = await api.post("/sales", payload);

      // Optimistic update (add to top)
        setSales((prev) => [res.data.data, ...prev]);

      toast.success("Sales recorded");
    } catch (error) {
      console.error("Error adding sales:", error);
      toast.error("Failed to add sales");
    }
  };

  // Delete latest (undo)
  const deleteLatestSales = async (productId) => {
    try {
      await api.delete(`/sales/latest/${productId}`);

      // Option 1 (safe): refetch
      await fetchAllSales();

      toast.success("Last sales removed");
    } catch (error) {
      console.error("Error deleting sales:", error);
      toast.error("Failed to undo sales");
    }
  };

  //  Auto-fetch when user logs in
  useEffect(() => {
    if (authUser) {
      fetchAllSales();
    } else {
      setSales([]);
    }
  }, [authUser]);

  return (
    <SalesContext.Provider
      value={{
        sales,
        loading,
        fetchAllSales,
        addSales,
        deleteLatestSales,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};
