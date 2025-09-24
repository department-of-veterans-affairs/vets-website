import React from 'react';

import GovBanner from './GovBanner';
import Nav from './Nav';

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
