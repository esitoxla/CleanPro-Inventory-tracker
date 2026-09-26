import { createBrowserRouter, RouterProvider } from "react-router";
import './App.css'
import Dashboard from './layout/Dashboard';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './context/themeContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ProductDashboard from './pages/ProductDashboard';
import ProductManagement from './pages/ProductManagement';

function ThemedToaster() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? "#1E293B" : "#fff",
          color: isDark ? "#4ade80" : "#16a34a",
          fontWeight: "600",
          borderRadius: "8px",
          border: isDark ? "1px solid #334155" : "none",
        },
        error: {
          style: { color: isDark ? "#f87171" : "#dc2626" },
        },
      }}
    />
  );
}

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
      <ThemedToaster />
    </>
  );
  
}

export default App
