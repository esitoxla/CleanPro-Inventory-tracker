import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router";
import './App.css'
import Dashboard from './layout/Dashboard';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProductDashboard from './pages/ProductDashboard';
import ProductManagement from './pages/ProductManagement';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: LoginPage,
    },
    {
      path: "/register",
      Component: RegisterPage,
    },
    {
      path: "/dashboard",
      Component: Dashboard,
      children: [
        {
          index: true,
          Component: ProductManagement,
        },
        {
          path: "workspace",
          Component: ProductDashboard,
        },
        {
          path: "home",
          Component: HomePage,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#16a34a",
            fontWeight: "600",
            borderRadius: "8px",
          },
          error: {
            style: { color: "#dc2626" },
          },
        }}
      />
    </>
  );
  
}

export default App
