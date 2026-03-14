import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ theme, onToggleTheme }) => {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-mark">//</span>
        <div>
          <h1>URL Shortener</h1>
          <p>Production-grade links</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/stats">Stats</NavLink>
      </nav>

      <button className="theme-toggle" onClick={onToggleTheme}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

export default Navbar;
