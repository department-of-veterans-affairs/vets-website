import React from 'react';

import MobileHeader from './MobileHeader/MobileHeader';
import WiderThanMobileHeader from './WiderThanMobileHeader/WiderThanMobileHeader';

import './Header.scss';

const Header = () => {
  return (
    <header
      data-testid="arp-header"
      className="header arp-header"
      role="banner"
    >
      <MobileHeader />
      <WiderThanMobileHeader />
    </header>
  );
};

export default Header;
