import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlansPage from "./pages/PlansPage";
import OperatorsPage from "./pages/OperatorsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import CustomersPage from "./pages/CustomersPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

const pageMeta = {
  "/": { page: "home", title: "Subscription Platform - Landing Page" },
  "/plans": { page: "plans", title: "Plans - Lexicon Telecom" },
  "/operators": { page: "operators", title: "Operators - Lexicon Telecom" },
  "/subscriptions": {
    page: "subscriptions",
    title: "Subscriptions - Lexicon Telecom",
  },
  "/customers": { page: "customers", title: "Customers - Lexicon Telecom" },
  "/user-dashboard": {
    page: "dashboard",
    title: "My dashboard - Lexicon Telecom",
  },
  "/admin-dashboard": {
    page: "dashboard",
    title: "Admin dashboard - Lexicon Telecom",
  },
};

export default function App() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta["/"];

  useEffect(() => {
    document.body.className = "bg-slate-50 text-slate-600 antialiased";
    document.body.dataset.page = meta.page;
    document.title = meta.title;
  }, [meta.page, meta.title]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/plans"
        element={
          <ProtectedRoute>
            <PlansPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operators"
        element={
          <ProtectedRoute>
            <OperatorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <SubscriptionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute admin>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
