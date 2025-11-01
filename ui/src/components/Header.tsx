import React from 'react';

interface HeaderProps {
  currentPage: 'order' | 'admin';
  onNavigate: (page: 'order' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [logoError, setLogoError] = React.useState(false);
  
  return (
    <header className="header">
      <div className="header-content">
        <div className="brand">
          {!logoError ? (
            <img 
              src="/cozy-logo.svg" 
              alt="COZY" 
              className="brand-logo"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>COZY</span>
          )}
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
