import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <h1>PG Management<span className="accent">System</span></h1>
        </div>
        <nav className="nav-links">
          <a href="#" className="active">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
        <div className="auth-buttons">
          <button className="btn-secondary">Sign In</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
