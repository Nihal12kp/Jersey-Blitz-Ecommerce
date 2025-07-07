import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./Pages/Admin/Admin";
import AdminLogin from "./Pages/AdminLogin/AdminLogin";
import ProtectedRoute from "./Components/ProtectedRoute"

const App = () => {
  return (
    <Routes>
      {/* Protected admin route */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      {/* Public routes */}
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/" element={<AdminLogin />} />
    </Routes>
  );
};

export default App;
