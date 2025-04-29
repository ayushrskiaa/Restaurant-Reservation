// import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <div className="banner">
            <div className="top">
              <h1 className="heading">ABOUT US</h1>
              <p>Serving the best food </p>
            </div>
            <p className="mid">
              Welcome to our café, where every visit feels like home. We take
              pride in serving freshly brewed coffee, handcrafted beverages, and
              a menu filled with delicious dishes made from the finest
              ingredients. Whether you are here for a quick bite, a relaxing
              meal, or a place to work and unwind, our warm ambiance and
              friendly staff are here to make your experience unforgettable.
              Join us and savor the perfect blend of taste, comfort, and
              community.
            </p>
            <Link to={"/"}>
              Explore Menu{" "}
              <span>
                <HiOutlineArrowRight />
              </span>
            </Link>
          </div>
          <div className="banner">
            <img
              src="https://images.pexels.com/photos/12129480/pexels-photo-12129480.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="about"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
