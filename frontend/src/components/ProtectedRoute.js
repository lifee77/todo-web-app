// ProtectedRoute.js
// We will use a ProtectedRoute component to handle authentication for protected routes.
//This component checks if the user is authenticated. If not, it redirects them to the login page.
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
