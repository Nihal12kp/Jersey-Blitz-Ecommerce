import React from "react";
import "./Navbar.css";
import jer from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";

const navbar = () => {
  return (
    <div className="navbar">
      <img src={jer} alt="" className="nav-logo" />
      <img src={navProfile} alt="" className="nav-profile" />
    </div>
  );
};

export default navbar;
