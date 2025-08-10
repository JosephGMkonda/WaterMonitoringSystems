import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/ContextAuth";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
