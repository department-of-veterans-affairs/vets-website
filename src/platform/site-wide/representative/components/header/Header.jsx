import React from 'react';
import GovBanner from './GovBanner';
import Nav from './Nav';
import './header.scss';

const Header = profile => {
  return (
    <header
      data-testid="arp-header"
      className="header vads-u-background-color--white"
    >
      <GovBanner />
      <Nav {...profile} />
    </header>
  );
};

export default Header;
