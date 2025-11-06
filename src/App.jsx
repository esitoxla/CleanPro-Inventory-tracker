import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router";
import './App.css'
import Dashboard from './layout/Dashboard';
import LiquidSoap from './components/LiquidSoap';
import FloorCleaner from './components/FloorCleaner';
import Bleach from './components/Bleach';
import GlassCleaner from './components/GlassCleaner';
import Softener from './components/Softener';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: LoginPage,
    },
    {
      path: "/dashboard",
      Component: Dashboard,
      children: [
        {
          index: true,
          Component: LiquidSoap,
        },
        {
          path: "floor",
          Component: FloorCleaner,
        },
        {
          path: "bleach",
          Component: Bleach,
        },
        {
          path: "glass",
          Component: GlassCleaner,
        },
        {
          path: "softener",
          Component: Softener,
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
