import React, { useState } from "react";
import "./css/Aside.css";

const AsideMenu = ({ isAsideOpen, isLoggedIn }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const renderSection = (title, items, keyForSection) => (
    <li key={keyForSection}>
      <h4
        onClick={() => toggleSection(title.toLowerCase())}
        className={expandedSections[title.toLowerCase()] ? "expanded" : ""}
      >
        {title}
      </h4>
      <ul className={expandedSections[title.toLowerCase()] ? "expanded" : ""}>
        {items.map((item) => (
          <li key={item.link}>
            <a href={item.link}>{item.text}</a>
          </li>
        ))}
      </ul>
    </li>
  );
  //ogolnie widoczne sekcje jako default
  const commonSections = [
    {
      title: "Home",
      items: [{ link: "/", text: "Home" }],
    },
    {
      title: "About",
      items: [{ link: "/about", text: "About Us" }],
    },
    {
      title: "REGULATIONS",
      items: [{ link: "/regulations", text: "Site Regulations" }],
    },
  ];

  //tylko zalogwani widza te sekcje
  const loggedInSections = [
    {
      title: "MY CONTENT",
      items: [
        { link: "/favorites", text: "Favorites" },
        { link: "/my-posts", text: "My Posts" },
      ],
    },
    {
      title: "CONTACT",
      items: [{ link: "/contact", text: "Contact Us" }],
    },
  ];

  const loggedOutSections = [
    //mozna dodac jesli tylko niezalogowany ma widziec ta sekcje
  ];

  return (
    <aside className={`aside-menu ${isAsideOpen ? "aside-menu--open" : ""}`}>
      <nav className="aside-menu__nav">
        <ul>
          {/* <li>
            <a href="/">Home</a>
          </li> */}
          {/* Reszta sekcji Common */}
          {commonSections.map((section, index) =>
            renderSection(section.title, section.items, `common-${index}`)
          )}
          {/* Reszta sekcji dla zalogowanych */}
          {isLoggedIn
            ? loggedInSections.map((section, index) =>
                renderSection(section.title, section.items, `loggedIn-${index}`)
              )
            : // Reszta sekcji dla nie zalogowanych !tylko!
              loggedOutSections.map((section, index) =>
                renderSection(
                  section.title,
                  section.items,
                  `loggedOut-${index}`
                )
              )}
        </ul>
      </nav>
    </aside>
  );
};

export default AsideMenu;
