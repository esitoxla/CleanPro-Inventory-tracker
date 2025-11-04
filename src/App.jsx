import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router";
import './App.css'
import Dashboard from './layout/Dashboard';
import LiquidSoap from './components/LiquidSoap';
import HomePage from './pages/HomePage';
import FloorCleaner from './components/FloorCleaner';
import Bleach from './components/Bleach';
import GlassCleaner from './components/GlassCleaner';
import Softener from './components/Softener';
import { Toaster } from 'react-hot-toast';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: HomePage
    },
    {
      path: "/dashboard",
      Component: Dashboard,
      children: [
        {
          index: true,
          Component: LiquidSoap
        },
        {
          path: "floor",
          Component: FloorCleaner
        },
        {
          path: "bleach",
          Component: Bleach
        },
        {
          path: "glass",
          Component: GlassCleaner
        },
        {
          path: "softener",
          Component: Softener
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />;
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
