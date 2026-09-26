import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ProductContext } from "../context/ProductsContext";
import { useTheme } from "../context/themeContext";
import { getProductColor } from "../utils/productColor";
import { IoTrashOutline, IoCreateOutline } from "react-icons/io5";

const colorOptions = [
  "red",
  "dark red",
  "light red",
  "green",
  "dark green",
  "light green",
  "blue",
  "dark blue",
  "light blue",
  "yellow",
  "dark yellow",
  "light yellow",
  "orange",
  "dark orange",
  "light orange",
  "purple",
  "dark purple",
  "light purple",
  "pink",
  "dark pink",
  "light pink",
  "gray",
  "dark gray",
  "light gray",
  "black",
  "white",
];

export default function ProductManagement() {
  const navigate = useNavigate();
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useContext(ProductContext);
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      if (!name) {
        toast.error("Name is required");
        return;
      }
      await updateProduct(editingId, { name, description });
    } else {
      if (!name || !color) {
        toast.error("Name and color are required");
        return;
      }
      await createProduct({ name, description, color });
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setColor("");
  };

  const handleDelete = (product) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-2">
        <span className="font-medium text-gray-700 dark:text-slate-100">
          Delete "{product.name}"?
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => {
              deleteProduct(product.id);
              toast.dismiss(t.id);
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

  const handleOpenWorkspace = (product) => {
    setSelectedProduct(product);
    navigate("/dashboard/workspace");
  };

  return (
    <div className="p-2 space-y-6">
      <h1 className="text-3xl font-bold text-[#223962] dark:text-slate-100">
        Manage Your Products
      </h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-4 items-end dark:bg-slate-800 dark:border-slate-700"
      >
        <div className="flex-1 w-full">
          <label className="block text-gray-600 mb-1 font-medium dark:text-slate-400">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Liquid Soap"
            className="border border-gray-200 p-3 rounded-lg w-full bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-gray-600 mb-1 font-medium dark:text-slate-400">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            className="border border-gray-200 p-3 rounded-lg w-full bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-500"
          />
        </div>

        {!editingId && (
          <div className="w-full md:w-48">
            <label className="block text-gray-600 mb-1 font-medium dark:text-slate-400">
              Color
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border border-gray-200 p-3 rounded-lg w-full capitalize bg-white dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700"
            >
              <option value="">Select a color</option>
              {colorOptions.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all w-full md:w-auto"
        >
          {editingId ? "Save Changes" : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="text-gray-500 hover:text-gray-700 font-semibold py-3 px-4 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 && (
          <p className="text-gray-500 italic col-span-full dark:text-slate-400">
            No products yet — add your first one above.
          </p>
        )}

        {products.map((product) => {
          const brandColor = product.color
            ? getProductColor(product.color, theme)
            : undefined;

          return (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border-l-4 dark:bg-slate-800 dark:ring-1 dark:ring-slate-700"
            style={{ borderColor: brandColor }}
          >
            <div className="flex items-center justify-between">
              <h2
                className="font-bold text-lg text-gray-800 dark:text-slate-100"
                style={brandColor ? { color: brandColor } : undefined}
              >
                {product.name}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-gray-400 hover:text-cyan-600 dark:text-slate-400"
                  title="Edit"
                >
                  <IoCreateOutline size={20} />
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="text-gray-400 hover:text-red-600 dark:text-slate-400"
                  title="Delete"
                >
                  <IoTrashOutline size={20} />
                </button>
              </div>
            </div>

            {product.description && (
              <p className="text-sm text-gray-500 dark:text-slate-400">{product.description}</p>
            )}

            <button
              onClick={() => handleOpenWorkspace(product)}
              className="bg-[#223962] hover:bg-[#1a2c4d] text-white font-semibold py-2 px-4 rounded-lg transition-all mt-auto dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Open Dashboard →
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
}
