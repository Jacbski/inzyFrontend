import React, { useState, useEffect } from "react";
import "./css/header.scss";
import AsideMenu from "../Aside/Aside";
import Logo from "../../assets/logo.svg";
import UserIcon from "../../assets/user-icon.png";
import SearchIcon from "../../assets/search-icon.png";

const Header = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(window.innerWidth > 1300);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1300) {
        setIsAsideOpen(true);
      } else {
        setIsAsideOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleAside = () => {
    if (window.innerWidth <= 1300) {
      setIsAsideOpen(!isAsideOpen);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
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
      <header className={`header ${isAsideOpen ? "aside-menu--open" : ""}`}>
        <div className="header__container">
          {/* Lewa strona */}
          <div className="header__left">
            {/* Przycisk menu - widoczny tylko w wersji mobilnej */}
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
                ✖
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
              🔍
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
      {/* Aside menu - osobny komponent */}
      <AsideMenu isAsideOpen={isAsideOpen} isLoggedIn={isLoggedIn} />
      {/* Modal wyszukiwania dla mobile */}
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
