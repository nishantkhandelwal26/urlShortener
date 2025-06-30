import React from "react";
import { Navigate } from "react-router-dom";
import { useStoreContext } from "./contextApi/ContextApi";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useStoreContext();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-btnColor"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;
