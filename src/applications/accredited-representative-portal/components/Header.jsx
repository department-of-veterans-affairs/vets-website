import React from 'react';

import GovBanner from './Header/GovBanner';
import Nav from './Header/Nav';

const Header = () => {
  return (
    <header
      data-testid="arp-header"
      className="header vads-u-background-color--white"
    >
      <GovBanner />
      <Nav />
    </header>
  );
};

export default Header;
