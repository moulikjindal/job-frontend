import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import FullPageLoader from "../Common/FullPageLoader";

const ProtectedRoute = ({ children }) => {
  const { isAuthorized, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <FullPageLoader />;
  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

export default ProtectedRoute;
