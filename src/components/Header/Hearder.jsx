//V12 -use auth dziala
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/header.scss";
import AsideMenu from "../Aside/Aside";
import Logo from "../../assets/logo.svg";
import UserIcon from "../../assets/user-icon.png";
import SearchIcon from "../../assets/search-icon.png";
import LoginModal from "../Modals/LoginModal/LoginModal";
import RegisterModal from "../Modals/RegisterModal/RegisterModal";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(window.innerWidth > 1300);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const navigate = useNavigate();

  const { isLoggedIn, currentUser, login, register, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsAsideOpen(window.innerWidth > 1300);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("Current user in Header:", currentUser);
  }, [currentUser]);

  const toggleAside = () => {
    if (window.innerWidth <= 1300) {
      setIsAsideOpen(!isAsideOpen);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogoutClick = () => {
    console.log("Logout clicked");
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const handleLogin = async (username, password) => {
    try {
      console.log("Handling login");
      await login(username, password);
      setIsLoginModalOpen(false);
      setIsUserMenuOpen(false);
      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      await register(username, email, password);
      setIsRegisterModalOpen(false);
      // setIsUserMenuOpen(false);
      // navigate("/profile");
    } catch (error) {
      console.log("Registarion failed:", error);
      alert("Registration failed. Please check your information.");
    }
  };

  return (
    <>
      <header className={`header ${isAsideOpen ? "aside-menu--open" : ""}`}>
        <div className="header__container">
          <div className="header__left">
            <button className="header__menu-button" onClick={toggleAside}>
              ☰
            </button>
            <div className="header__logo">
              <Link to="/">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>
          </div>
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
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  console.log("Searching:", searchText);
                }
              }}
            />
            {searchText && (
              <button
                className="header__clear-button"
                onClick={() => setSearchText("")}
              >
                ✖
              </button>
            )}
          </div>
          <div className="header__right">
            <button
              className="header__icon-button header__search-icon-mobile"
              onClick={() => setIsSearchModalOpen(true)}
            >
              🔍
            </button>
            <button className="header__icon-button" onClick={toggleUserMenu}>
              <img
                src={UserIcon}
                alt="User Profile"
                className="header__icon-user"
              />
            </button>
            {isUserMenuOpen && (
              <div className="header__user-menu">
                {!isLoggedIn ? (
                  <>
                    <button
                      className="header__button"
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      className="header__button"
                      onClick={() => {
                        setIsRegisterModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="header__button"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {currentUser
                        ? `Hello, ${currentUser.userName}`
                        : "Loading..."}
                    </Link>
                    <button
                      className="header__button"
                      onClick={handleLogoutClick}
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
      <AsideMenu isAsideOpen={isAsideOpen} isLoggedIn={isLoggedIn} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onRequestClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onRequestClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
      />
    </>
  );
};

export default Header;
