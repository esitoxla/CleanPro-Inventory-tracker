import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../config/axios";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

export const ProductionContext = createContext();

export const ProductionProvider = ({ children }) => {
  const { authUser } = useContext(AuthContext);

  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(false);

  //  Fetch all productions
  const fetchProductions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/productions");

      setProductions(res.data.data || []);
    } catch (error) {
      console.error("Error fetching productions:", error);
      toast.error("Failed to load production data");
    } finally {
      setLoading(false);
    }
  };

  // Add production
  const addProduction = async (payload) => {
    try {
      const res = await api.post("/productions", payload);

      // Optimistic update (add to top)
      setProductions((prev) => [res.data.data, ...prev]);

      

      toast.success("Production recorded");
    } catch (error) {
      console.error("Error adding production:", error);
      toast.error("Failed to add production");
    }
  };

  // Delete latest production (undo)
  const deleteLatestProduction = async (productId) => {
    try {
      await api.delete(`/productions/latest/${productId}`);

      // Option 1 (safe): refetch
      await fetchProductions();

      toast.success("Last production removed");
    } catch (error) {
      console.error("Error deleting production:", error);
      toast.error("Failed to undo production");
    }
  };

  //  Auto-fetch when user logs in
  useEffect(() => {
    if (authUser) {
      fetchProductions();
    } else {
      setProductions([]);
    }
  }, [authUser]);

  return (
    <ProductionContext.Provider
      value={{
        productions,
        loading,
        fetchProductions,
        addProduction,
        deleteLatestProduction,
      }}
    >
      {children}
    </ProductionContext.Provider>
  );
};
