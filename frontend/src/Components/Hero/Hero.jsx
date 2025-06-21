import React from "react";
import "./Hero.css";
import foot_icon from "../Assets/Foot_icon.png";
import arrow_icon from "../Assets/arrow.png";
import messi_image from "../Assets/messi_image.png";
const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className="hero-hand-icon">
            <p>New</p>
            <img src={foot_icon} alt="" />
          </div>
          <p>Collection</p>
          <p>For Everyone</p>
        </div>
        <div className="hero-latest-btn">
          <div>Latest Collection</div>
          <img src={arrow_icon} alt="" />
        </div>
      </div>
      <div className="hero-right">
        <img src={messi_image} alt="" />
      </div>
    </div>
  );
};

export default Hero;
