import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
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
        <Link to="/" className="logo">TournaCraft</Link>
        <nav className="header-nav">
          <Link to="/polls" className="nav-link">
            View All Polls
          </Link>
          <button onClick={toggleTheme} className="iba-kulay" aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

        </nav>
      </div>
    </header>
  );
};

export default Header;