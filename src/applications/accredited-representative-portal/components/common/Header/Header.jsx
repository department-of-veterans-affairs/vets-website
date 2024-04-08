import React from 'react';

import LogoRow from './LogoRow';
import Menu from './Menu';
import MobileHeader from './MobileHeader';
import OfficialGovtWebsite from './OfficialGovtWebsite';
import VeteranCrisisLine from './VeteranCrisisLine';

import './Header.scss';

const Header = () => {
  return (
    <header className="header" role="banner">
      <MobileHeader />
      <div id="legacy-header" className="desktop">
        <div className="va-notice--banner">
          <div className="va-notice--banner-inner">
            <OfficialGovtWebsite />
          </div>
          <VeteranCrisisLine />
        </div>
        <LogoRow />
        <Menu />
      </div>
    </header>
  );
};

export default Header;
