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
import StationPage from "./Pages/StationPage";
import StationDetails from "./Pages/StationDetails";
import Order from "./Pages/Order";
import ForgetPassword from "./Pages/ForgetPassword";
import VerifyOTP from "./Pages/VerifyOTP";
import ResetPassword from "./Pages/ResetPassword";
import Index from "./Pages/Index";
import Customers from "./Pages/Customers";
import CustomerPage from "./Pages/CustomerPage";
import UnderConstruction from "./Pages/UnderConstruction";
import OrderDetails from "./Pages/OrderDetails";
import AgentPage from "./Pages/AgentPage";
import Transactions from "./Pages/Transactions";
import ChangePassword from "./Pages/ChangePassword";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path='privacy-policy' element={
          <PrivacyPolicy/>
        }/>
         <Route path='auth/forgot-password' element={
         <GuestRoute>
           <ForgetPassword/>
         </GuestRoute>
        }/>
        <Route path='auth/verify-otp' element={
          <GuestRoute>
            <VerifyOTP/>
          </GuestRoute>
        }/>

        <Route path='auth/reset-password' element={
         <GuestRoute>
           <ResetPassword/>
         </GuestRoute>
        }/>

        <Route path='auth/change-password' element={
         <GuestRoute>
           <ChangePassword/>
         </GuestRoute>
        }/>

        <Route
          index
          element={
            <Index/>
          }
        />
        <Route
          path="auth/login"
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
        <Route
          path="stations"
          element={
            <Protected>
              <StationPage />
            </Protected>
          }
        />
        <Route
          path="stations/:stationId"
          element={
            <Protected>
              <StationDetails />
            </Protected>
          }
        />

        <Route
          path="orders"
          element={
            <Protected>
              <Order />
            </Protected>
          }
        />
        <Route
          path="orders/:orderId"
          element={
            <Protected>
              <OrderDetails
               />
            </Protected>
          }
        />
        <Route
          path="orders/:orderId/transactions"
          element={
            <Protected>
              <Transactions
               />
            </Protected>
          }
        />
        <Route
          path="customers"
          element={
            <Protected>
              <Customers />
            </Protected>
          }
        />
        <Route
          path="customers/:customerId"
          element={
            <Protected>
              <CustomerPage />
            </Protected>
          }
        />
        <Route
          path="agents"
          element={
            <Protected>
              <AgentPage />
            </Protected>
          }
        />
        <Route
          path="admins"
          element={
            <Protected>
              <UnderConstruction />
            </Protected>
          }
        />
        <Route
          path="drivers"
          element={
            <Protected>
              <UnderConstruction />
            </Protected>
          }
        />
        <Route
          path="analytics"
          element={
            <Protected>
              <UnderConstruction />
            </Protected>
          }
        />
        <Route
          path="logs"
          element={
            <Protected>
              <UnderConstruction />
            </Protected>
          }
        />
        <Route
          path="settings"
          element={
            <Protected>
              <UnderConstruction />
            </Protected>
          }
        />
        <Route
          path="profile"
          element={
            <Protected>
              <UnderConstruction />
            </Protected>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );

function App() {

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
