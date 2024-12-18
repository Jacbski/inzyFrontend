import React from "react";
import "./css/About.scss";

const About = () => {
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>
        Welcome to the PIOT. Our platform is dedicated to fostering
        collaboration, sharing knowledge, and driving innovation in the field of
        Internet of Things (IoT) technologies.
      </p>
      <h2>Our Mission</h2>
      <p>
        We strive to create a community where enthusiasts, professionals, and
        developers can come together to explore, learn, and contribute to open
        source IoT projects.
      </p>
      <h2>Why Join Us?</h2>
      <ul>
        <li>Access to a diverse range of IoT resources and discussions.</li>
        <li>Collaborate with like-minded individuals and industry experts.</li>
        <li>Contribute to the growth of open source IoT technologies.</li>
      </ul>
      <h2>Get Involved</h2>
      <p>
        Whether you’re a seasoned developer or a curious beginner, there’s a
        place for you here. Join our discussions, contribute to projects, or
        simply explore the wealth of information available.
      </p>
    </div>
  );
};

export default About;
