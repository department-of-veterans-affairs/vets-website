import React from 'react';

// eslint-disable-next-line import/extensions
import GovBanner from './Header/GovBanner.jsx';
// eslint-disable-next-line import/extensions
import Nav from './Header/Nav.jsx';

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
