import React from 'react';
import MobileHeader from './MobileHeader/MobileHeader';

import './Header.scss';

const Header = () => {
  return (
    <header data-testid="arp-header" className="header arp-header">
      <MobileHeader />
    </header>
  );
};

export default Header;
