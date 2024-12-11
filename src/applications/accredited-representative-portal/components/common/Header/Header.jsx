import React from 'react';
import OfficialGovtWebsite from './OfficialGovtWebsite';
import Navigation from './Navigation';

const Header = () => {
  return (
    <header data-testid="arp-header" className="header">
      <OfficialGovtWebsite />
      <Navigation />
    </header>
  );
};

export default Header;
