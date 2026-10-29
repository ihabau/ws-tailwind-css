import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ admin = false, children }) {
  const { loggedIn, admin: isAdminUser } = useAuth();

  if (!loggedIn) {
    return <Navigate to="/#login" replace />;
  }

  if (admin && !isAdminUser) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
}
