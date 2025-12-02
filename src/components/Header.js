// src/components/Header.js (Complete Corrected File)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'react-feather';
import './Header.css';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme ? savedTheme : 'dark';
};

const Header = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <img src="/dark-logo.png" alt="Very Black" className="logo-image Smoke" />
          <img src="/light-logo.png" alt="Flashbang" className="logo-image Flashbang" />
        </Link>
        <nav className="header-nav">
          <Link to="/polls" className="nav-link">
            View All Polls
          </Link>
          <button onClick={toggleTheme} className="iba-kulay" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;