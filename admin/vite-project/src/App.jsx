import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./Pages/Admin/Admin";
import AdminLogin from "./Pages/AdminLogin/AdminLogin";

const App = () => {
  return (
    <Routes>
      {/* Main admin route with nested routes */}
      <Route path="/admin/*" element={<Admin />} />

      {/* Admin login route */}
      <Route path="/adminlogin" element={<AdminLogin />} />

      {/* Redirect base path to login */}
      <Route path="/" element={<AdminLogin />} />
    </Routes>
  );
};

export default App;
