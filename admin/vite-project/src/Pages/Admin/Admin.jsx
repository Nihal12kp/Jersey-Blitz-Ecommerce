import React from "react";
import "./Admin.css";
import { Sidebar } from "../../Components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import UsersList from "../../Components/UsersList/UsersList";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        {/* Default route when accessing /admin */}
        <Route index element={<AddProduct />} />

        {/* Correct nested routes */}
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="listproduct" element={<ListProduct />} />
        <Route path="userlist" element={<UsersList />} />
      </Routes>
    </div>
  );
};

export default Admin;
