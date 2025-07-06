// ErrorPage.js
import React from "react";
import "./ErrorPage.css";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

const ErrorPage = () => {
  return (
    <>
    <Navbar/>
    <div className="error-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="error-button">Go Home</a>
    </div>
    <Footer/>
    </>
  );
};

export default ErrorPage;
