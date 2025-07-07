import React from "react";
import "./Sidebar.css";
import { Link,useNavigate } from "react-router-dom";
import add_product_icon from "../../assets/Product_Cart.svg";
import users_List_icon from "../../assets/Users_list_icon.svg";
import list_product_icon from "../../assets/Product_list_icon.svg";

export const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("admin-token"); 
    navigate("/");
  };
  return (
    <div className="sidebar">
      <Link to={"/admin/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt=""></img>
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/admin/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt=""></img>
          <p> Product List</p>
        </div>
      </Link>
      <Link to={"/admin/userlist"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img
            src={users_List_icon}
            alt=""
            style={{ width: "34px", height: "31px" }}
          ></img>
          <p> Users List</p>
        </div>
      </Link>
      <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
    </div>
  );
};
