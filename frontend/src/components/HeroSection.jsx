// import React from "react";
import Navbar from "./Navbar";

const HeroSection = () => {
  return (
    <section className="heroSection" id="heroSection">
      <Navbar />
      <div className="container">
        <div className="banner">
          <div className="largeBox">
            <h1 className="title">Delicious.</h1>
          </div>
          <div className="combined_boxes">
            <div className="imageBox">
              {/* <img src="./hero1.png" alt="hero" /> */}
              <img src="https://images.pexels.com/photos/28959315/pexels-photo-28959315/free-photo-of-colorful-mexican-cuisine-on-rustic-table.jpeg?auto=compress&cs=tinysrgb&w=600" alt="hero" />

            </div>
            <div className="textAndLogo">
              <div className="textWithSvg">
                <h1 className="title">Fresh.</h1>
                <h1 className="title dishes_title">Dishes</h1>
                <img src="./threelines.svg" alt="threelines" />
              </div>
              <img className="logo" src="logo.svg" alt="logo" />
            </div>
          </div>
        </div>
        <div className="banner">
          <div className="imageBox">
            <img src="https://images.pexels.com/photos/5713766/pexels-photo-5713766.jpeg?auto=compress&cs=tinysrgb&w=600" alt="hero" />
          </div>
          <h1 className="title dishes_title third">Inviting.</h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
