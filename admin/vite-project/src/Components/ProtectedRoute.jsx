// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("admin-token");

  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);

    const isValid = decoded?.user?.id && decoded?.user?.admin === true;

    if (isValid) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
