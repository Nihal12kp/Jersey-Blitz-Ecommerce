import React from "react";
import "./Footer.css";
import logo from "../Assets/New_logo.png";
import instagram_icon from "../Assets/instagram_icon.png";
import watsaap_icon from "../Assets/whatsapp_icon.png";
function Footer({ minHeight }) {
  const dynamicStyle = minHeight ? { minHeight } : {};
  return (
    <div className="footer" style={dynamicStyle}>
      <div className="footer-logo">
        <img src={logo} alt="" />
        <p>JERSEY BLITZ</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icons">
        <div className="footer-icons-container">
          <img src={instagram_icon} alt="" />
        </div>
        <div className="footer-icons-container">
          <img src={watsaap_icon} alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @ 2024 - All Right Reserved</p>
      </div>
    </div>
  );
}

export default Footer;
