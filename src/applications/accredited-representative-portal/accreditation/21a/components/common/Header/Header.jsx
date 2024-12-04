import React from 'react';

import MobileHeader from './MobileHeader/MobileHeader';
import WiderThanMobileHeader from './WiderThanMobileHeader/WiderThanMobileHeader';

import './Header.scss';

const Header = () => {
  return (
    <header data-testid="arp-header" className="header arp-header">
      <MobileHeader />
      <WiderThanMobileHeader />
    </header>
  );
};

export default Header;
