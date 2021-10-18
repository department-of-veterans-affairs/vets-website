import React, { useState } from 'react';
import HeaderBanners from './header-banners';
import MainHeaderContent from './main-header-content';
import DropdownMenu from './dropdown-menu';
import BrowserDeprecationCheck from './browser-deprecation-check';

const Header = props => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { noNavOrLogin } = props;

  return (
    <header className="header">
      <BrowserDeprecationCheck />

      <HeaderBanners />

      <MainHeaderContent
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        noNavOrLogin={noNavOrLogin}
      />

      <DropdownMenu menuOpen={menuOpen} />
    </header>
  );
};

export default Header;
