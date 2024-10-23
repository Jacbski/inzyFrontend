import React, { useState } from "react";
import "./css/aside.scss";

const AsideMenu = ({ isAsideOpen, isLoggedIn }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <aside className={`aside-menu ${isAsideOpen ? "aside-menu--open" : ""}`}>
      <nav className="aside-menu__nav">
        <ul>
          <li>
            <a href="/home">Popular</a>
          </li>
          <li>
            <h4
              onClick={() => toggleSection("recent")}
              className={expandedSections["recent"] ? "expanded" : ""}
            >
              RECENT
            </h4>
            {expandedSections["recent"] && <a href="/test">test</a>}
          </li>
          <li>
            <h4
              onClick={() => toggleSection("topics")}
              className={expandedSections["topics"] ? "expanded" : ""}
            >
              TOPICS
            </h4>
            <ul className={expandedSections["topics"] ? "expanded" : ""}>
              <li>
                <a href="/internet-culture">Internet Culture (Viral)</a>
              </li>
              <li>
                <a href="/games">Games</a>
              </li>
              <li>
                <a href="/qnas">Q&As</a>
              </li>
              <li>
                <a href="/technology">Technology</a>
              </li>
              <li>
                <a href="/pop-culture">Pop Culture</a>
              </li>
              <li>
                <a href="/movies-tv">Movies & TV</a>
              </li>
            </ul>
            <a href="/more-topics">See more</a>
          </li>
          <li>
            <h4
              onClick={() => toggleSection("resources")}
              className={expandedSections["resources"] ? "expanded" : ""}
            >
              RESOURCES
            </h4>
            <ul className={expandedSections["resources"] ? "expanded" : ""}>
              <li>
                <a href="/about">About Reddit</a>
              </li>
              <li>
                <a href="/advertise">Advertise</a>
              </li>
              <li>
                <a href="/help">Help</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
              <li>
                <a href="/careers">Careers</a>
              </li>
              <li>
                <a href="/press">Press</a>
              </li>
            </ul>
          </li>
          <li>
            <h4
              onClick={() => toggleSection("communities")}
              className={expandedSections["communities"] ? "expanded" : ""}
            >
              COMMUNITIES
            </h4>
            <ul className={expandedSections["communities"] ? "expanded" : ""}>
              <li>
                <a href="/best">Best of Reddit</a>
              </li>
              <li>
                <a href="/topics">Topics</a>
              </li>
            </ul>
          </li>
          <li>
            <h4
              onClick={() => toggleSection("policies")}
              className={expandedSections["policies"] ? "expanded" : ""}
            >
              POLICIES
            </h4>
            <ul className={expandedSections["policies"] ? "expanded" : ""}>
              <li>
                <a href="/content-policy">Content Policy</a>
              </li>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="/user-agreement">User Agreement</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AsideMenu;
