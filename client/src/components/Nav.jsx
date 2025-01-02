import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import navLogo from '../assets/navLogo.svg';
import searchIcon from '../assets/searchIcon.svg';
import '../styles/NavBar.css';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <NavLink to="/" className="nav-logo" onClick={closeMenu}>
            <img src={navLogo} alt="navLogo" />
          </NavLink>
        </div>

        <div className={`nav-center ${isOpen ? 'open' : ''}`}>
          <ul>
            <NavLink to="/apparel" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              <li>Apparel</li>
            </NavLink>
            <NavLink to="/snowboards" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              <li>Snowboards</li>
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              <li>Contact</li>
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
              <li>Cart</li>
            </NavLink>
          </ul>
        </div>

        <div className="nav-right">
          <div className="search-bar">
            <input type="text" placeholder="For Display Only" />
            <span className="search-icon"><img src={searchIcon} alt="search-icon" /></span>
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          {isOpen ? (
            <span className="close-icon">&#x2715;</span> // Unicode for "X" (✖️)
          ) : (
            <>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
