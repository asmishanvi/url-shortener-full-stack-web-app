import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">//</span>
          <div>
            <h1>URL Shortener</h1>
            <p>Fast links, clean insights.</p>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/stats">Stats</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
