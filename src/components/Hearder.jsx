import React, { useState } from "react";
import "./css/header.scss";
import Logo from "../assets/logo.svg";
import UserIcon from "../assets/user-icon.png";
import SearchIcon from "../assets/search-icon.png";
import ClearIcon from "../assets/clear-icon.png"; // ikony zmienic na react icons te sa pogladowe

const Header = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      // logika wyszukiwania lub z bazy
      console.log("Szukam:", searchText);
    }
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          {/* Lewa strona */}
          <div className="header__left">
            {/* Przycisk menu */}
            <button className="header__menu-button" onClick={toggleAside}>
              ☰
            </button>
            {/* Logo */}
            <div className="header__logo">
              <a href="/home">
                <img src={Logo} alt="Logo" />
              </a>
            </div>
          </div>
          {/* Pasek wyszukiwania */}
          <div className="header__search">
            <div className="header__search-icon">
              <img
                src={SearchIcon}
                alt="Search Icon"
                className="header__icon-small"
              />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="header__search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
            {searchText && (
              <button className="header__clear-button" onClick={clearSearch}>
                <img
                  src={ClearIcon}
                  alt="Clear"
                  className="header__icon-clear"
                />
              </button>
            )}
          </div>
          {/* Prawa strona */}
          <div className="header__right">
            {/* Ikona wyszukiwania dla mobile */}
            <button
              className="header__icon-button header__search-icon-mobile"
              onClick={toggleSearchModal}
            >
              <img
                src={SearchIcon}
                alt="Search"
                className="header__icon-small"
              />
            </button>
            {/* Ikona użytkownika */}
            <button className="header__icon-button" onClick={toggleUserMenu}>
              <img
                src={UserIcon}
                alt="User Profile"
                className="header__icon-user"
              />
            </button>
            {/* Menu użytkownika */}
            {isUserMenuOpen && (
              <div className="header__user-menu">
                {!isLoggedIn ? (
                  <>
                    <button
                      className="header__button"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setIsUserMenuOpen(false);
                      }}
                    >
                      Sign In
                    </button>
                    <button className="header__button">Register</button>
                  </>
                ) : (
                  <>
                    <button className="header__button">Profile</button>
                    <button
                      className="header__button"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsUserMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Aside menu - ogolnie do poprawki jako odzielny component */}
      {isAsideOpen && (
        <aside className="aside-menu">
          <nav className="aside-menu__nav">
            <ul>
              <li>
                <a href="/home">Home</a>
              </li>
              {isLoggedIn && (
                <>
                  <li>
                    <a href="/your-creations">Your Creations</a>
                  </li>
                  <li>
                    <a href="/favorites">Favorites</a>
                  </li>
                </>
              )}
              <li>
                <a href="/regulations">Regulations</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </nav>
        </aside>
      )}
      {/* Modal wyszukiwania dla mobile - do poprawki zle wystylizowałem - header.scss - temp file */}
      {isSearchModalOpen && (
        <div className="search-modal">
          <div className="search-modal__content">
            <button className="search-modal__close" onClick={toggleSearchModal}>
              ×
            </button>
            <input
              type="text"
              placeholder="Search"
              className="search-modal__input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
