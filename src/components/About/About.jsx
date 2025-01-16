import React from "react";
import "./css/About.scss";

const About = () => {
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>
        Welcome to PIOT - a platform crafted for IoT enthusiasts to connect,
        share projects, and ignite innovation in the captivating world of
        Internet of Things technologies.
      </p>
      <h2>Our Vision</h2>
      <p>
        We aspire to cultivate a vibrant community where hobbyists, tinkerers,
        and tech lovers can showcase their ideas, exchange knowledge, and
        explore innovative IoT projects together.
      </p>
      <h2>Why Join Us?</h2>
      <ul>
        <li>
          Explore inspiring IoT projects and resources shared by fellow
          enthusiasts.
        </li>
        <li>
          Engage in discussions and conversations with a passionate community of
          like-minded creators.
        </li>
        <li>
          Share your own IoT experiments and receive valuable feedback and
          support.
        </li>
      </ul>
      <h2>Get Involved</h2>
      <p>
        Whether you're a seasoned developer or a curious beginner delving into
        IoT for the first time, PIOT is the perfect place to start. Join
        discussions, share your creations, and discover the wealth of innovative
        ideas within our community.
      </p>
    </div>
  );
};

export default About;
