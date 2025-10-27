import React from 'react';

interface HeaderProps {
  currentPage: 'order' | 'admin';
  onNavigate: (page: 'order' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="brand">
          <img src="/cozy-logo.svg" alt="COZY" className="brand-logo" />
        </div>
        <nav className="navigation">
          <button 
            className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
            onClick={() => onNavigate('order')}
          >
            주문하기
          </button>
          <button 
            className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => onNavigate('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
