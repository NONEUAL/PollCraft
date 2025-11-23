import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">TournaCraft</Link>
        <nav>
          <Link to="/polls" className="nav-link">
            View All Polls
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
