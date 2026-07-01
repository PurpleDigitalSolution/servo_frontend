import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./root/Layout";
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";
import LoginPage from "./Pages/LoginPage";
import { Toaster } from "react-hot-toast";
import Protected from "./hooks/Protected";
import GuestRoute from "./hooks/GuestRoute";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
            style: {
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              borderLeft: "4px solid #10b981",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              borderLeft: "4px solid #ef4444",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
