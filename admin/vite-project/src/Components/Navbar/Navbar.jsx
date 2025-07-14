import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/nav_logo.png";
import profileIcon from "../../assets/nav_profile.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    navigate("/");
  };
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="nav-logo" />
        <span className="admin-title">Admin Panel</span>
      </div>
      <div className="navbar-right">
        <img src={profileIcon} alt="Admin" className="nav-profile" />
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};
export default Navbar;
