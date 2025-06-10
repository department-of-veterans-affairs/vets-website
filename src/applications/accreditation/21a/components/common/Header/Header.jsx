import React from 'react';

import GovBanner from './GovBanner';
import Nav from './Nav';
import Hero from './Hero';

const Header = () => {
  return (
    <header
      data-testid="arp-header"
      className="header vads-u-background-color--white"
    >
      <GovBanner />
      <Nav />
      <Hero />
    </header>
  );
};

export default Header;
