import React from 'react';
import './Header.css';

const Header = ({ onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <h1>PG Management<span className="accent">System</span></h1>
        </div>

        <div className="auth-buttons">
          <button className="btn-secondary" onClick={onLogout}>Sign Out</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
