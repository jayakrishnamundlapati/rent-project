import React from 'react';
import { Heart, Sun, Moon } from 'lucide-react';
import './Header.css';

const Header = ({ onLogout, onToggleTheme, isDark, savedCount, onShowWishlist }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo" onClick={() => onShowWishlist(false)} style={{cursor: 'pointer'}}>
          <h1>PG Management<span className="accent">System</span></h1>
        </div>

        <div className="auth-buttons">
          <button className="icon-btn theme-btn" onClick={onToggleTheme} title="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="icon-btn wishlist-nav" onClick={() => onShowWishlist(true)} title="View Wishlist">
            <Heart size={20} />
            {savedCount > 0 && <span className="wishlist-badge">{savedCount}</span>}
          </button>

          <button className="btn-secondary" onClick={onLogout}>Sign Out</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
