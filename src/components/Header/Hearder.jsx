// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./css/header.css";
// import Logo from "../../assets/logo.svg";
// import UserIcon from "../../assets/user-icon.png";
// import useAuth from "../../hooks/useAuth";
// import AsideMenu from "../Aside/Aside";
// import LoginModal from "../Modals/LoginModal/LoginModal";
// import RegisterModal from "../Modals/RegisterModal/RegisterModal";

// const Header = () => {
//   const [isAsideOpen, setIsAsideOpen] = useState(window.innerWidth > 1300);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [activeModal, setActiveModal] = useState(null);
//   const { isLoggedIn, currentUser, login, register, logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleResize = () => {
//       setIsAsideOpen(window.innerWidth > 1300);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleAside = () => {
//     if (window.innerWidth <= 1300) {
//       setIsAsideOpen(!isAsideOpen);
//     }
//   };

//   const toggleUserMenu = () => {
//     setIsUserMenuOpen(!isUserMenuOpen);
//   };

//   const openModal = (modalType) => {
//     setActiveModal(modalType);
//     setIsUserMenuOpen(false);
//   };

//   const handleLogoutClick = () => {
//     logout();
//     setIsUserMenuOpen(false);
//     navigate("/");
//   };

//   const handleLogin = async (username, password) => {
//     try {
//       await login(username, password);
//       setActiveModal(null);
//       navigate("/profile");
//     } catch (error) {
//       console.error("Login failed:", error);
//       alert("Login failed. Please check your credentials.");
//     }
//   };

//   const handleRegister = async (username, email, password) => {
//     try {
//       await register(username, email, password);
//       setActiveModal(null);
//       navigate("/");
//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert("Registration failed. Please check your information.");
//     }
//   };

//   return (
//     <>
//       <header className={`header ${isAsideOpen ? "aside-menu--open" : ""}`}>
//         <div className="header__container">
//           <div className="header__left">
//             <button className="header__menu-button" onClick={toggleAside}>
//               <span className="header__menu-icon"></span>
//             </button>
//             <div className="header__logo">
//               <Link to="/">
//                 <img src={Logo} alt="Logo" />
//               </Link>
//             </div>
//           </div>
//           <nav className="header__nav">
//             <ul>
//               <li>
//                 <Link to="/features">Features</Link>
//               </li>
//               <li>
//                 <Link to="/pricing">Pricing</Link>
//               </li>
//               <li>
//                 <Link to="/about">About</Link>
//               </li>
//             </ul>
//           </nav>
//           <div className="header__right">
//             {isLoggedIn && currentUser && (
//               <span className="header__username">
//                 Welcome {currentUser.userName}
//               </span>
//             )}
//             <div className="header__user">
//               <button className="header__user-button" onClick={toggleUserMenu}>
//                 <img
//                   src={UserIcon}
//                   alt="User Profile"
//                   className="header__user-icon"
//                 />
//               </button>
//               {isUserMenuOpen && (
//                 <div className="header__user-menu">
//                   {isLoggedIn ? (
//                     <>
//                       <Link to="/profile" className="header__menu-item">
//                         Profile
//                       </Link>
//                       <button
//                         className="header__menu-item"
//                         onClick={handleLogoutClick}
//                       >
//                         Logout
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         className="header__menu-item"
//                         onClick={() => openModal("login")}
//                       >
//                         Sign In
//                       </button>
//                       <button
//                         className="header__menu-item"
//                         onClick={() => openModal("register")}
//                       >
//                         Register
//                       </button>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <AsideMenu isAsideOpen={isAsideOpen} isLoggedIn={isLoggedIn} />

//       <LoginModal
//         isOpen={activeModal === "login"}
//         onRequestClose={() => setActiveModal(null)}
//         onLogin={handleLogin}
//       />

//       <RegisterModal
//         isOpen={activeModal === "register"}
//         onRequestClose={() => setActiveModal(null)}
//         onRegister={handleRegister}
//       />
//     </>
//   );
// };

// export default Header;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/header.css";
import Logo from "../../assets/logo.svg";
import UserIcon from "../../assets/user-icon.png";
import useAuth from "../../hooks/useAuth";
import AsideMenu from "../Aside/Aside";
import LoginModal from "../Modals/LoginModal/LoginModal";
import RegisterModal from "../Modals/RegisterModal/RegisterModal";

const Header = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(window.innerWidth > 1300);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const { isLoggedIn, currentUser, login, register, logout } = useAuth();
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsAsideOpen(window.innerWidth > 1300);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setIsUserMenuOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
      setActiveModal(null);
      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      await register(username, email, password);
      setActiveModal(null);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please check your information.");
    }
  };

  return (
    <>
      <header className={`header ${isAsideOpen ? "aside-menu--open" : ""}`}>
        <div className="header__container">
          <div className="header__left">
            <button className="header__menu-button" onClick={toggleAside}>
              <span className="header__menu-icon"></span>
            </button>
            <div className="header__logo">
              <Link to="/">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>
          </div>
          {/* <nav className="header__nav">
            <ul>
              <li>
                <Link to="/features">Features</Link>
              </li>
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav> */}
          <div className="header__right">
            {isLoggedIn && currentUser && (
              <span className="header__username">
                Welcome {currentUser.userName}
              </span>
            )}
            <div className="header__user" ref={userMenuRef}>
              <button className="header__user-button" onClick={toggleUserMenu}>
                <img
                  src={
                    currentUser && currentUser.avatar
                      ? `data:image/jpeg;base64,${currentUser.avatar}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={
                    currentUser
                      ? `${currentUser.userName}'s profile picture`
                      : "User profile"
                  }
                  className="header__user-icon"
                />
              </button>
              {isUserMenuOpen && (
                <div className="header__user-menu">
                  {isLoggedIn ? (
                    <>
                      <Link to="/profile" className="header__menu-item">
                        Profile
                      </Link>
                      <button
                        className="header__menu-item"
                        onClick={handleLogoutClick}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="header__menu-item"
                        onClick={() => openModal("login")}
                      >
                        Sign In
                      </button>
                      <button
                        className="header__menu-item"
                        onClick={() => openModal("register")}
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AsideMenu isAsideOpen={isAsideOpen} isLoggedIn={isLoggedIn} />

      <LoginModal
        isOpen={activeModal === "login"}
        onRequestClose={() => setActiveModal(null)}
        onLogin={handleLogin}
      />

      <RegisterModal
        isOpen={activeModal === "register"}
        onRequestClose={() => setActiveModal(null)}
        onRegister={handleRegister}
      />
    </>
  );
};

export default Header;
