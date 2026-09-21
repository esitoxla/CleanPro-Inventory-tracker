import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../config/axios";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { authUser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //get all products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/all");
      const fetchedProducts = res.data.products || [];

      setProducts(fetchedProducts);

      if (!selectedProduct && fetchedProducts.length > 0) {
        setSelectedProduct(fetchedProducts[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  //add a product
  const createProduct = async (data) => {
    try {
      const res = await api.post("/products/create", data);
      setProducts((prev) => [res.data.product, ...prev]);
      toast.success("Product added");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  //update a product
  const updateProduct = async (id, updatedData) => {
    try {
      const res = await api.put(`/products/${id}`, updatedData);

      const updatedProduct = res.data.product;

      // Update state locally
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p)),
      );

      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product");
    }
  };


  //delete a product
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    if (authUser) fetchProducts();
    else setProducts([]);
  }, [authUser]);

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedProduct,
        setSelectedProduct,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
