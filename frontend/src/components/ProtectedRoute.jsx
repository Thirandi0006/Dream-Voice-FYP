import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "user" or "admin"


  if (!token) return <Navigate to="/auth" replace />;

  if (role && userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
