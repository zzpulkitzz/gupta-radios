import React from 'react';
import '../styles/navbar.css';
import logo from "../../public/images/gupta-radios-logo.png"
const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="logo-container">
        <img 
          src={logo} 
          alt="Gupta Radios" 
          className="logo"
        />
      </a>
      <div className="nav-links">
        <a href="#legacy">Legacy</a>
        <a href="#products">Products</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
