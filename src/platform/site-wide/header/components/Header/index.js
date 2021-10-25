// Node modules.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BrowserDeprecationMessage from './browser-deprecation-message';
import HeaderBanners from './header-banners';
import MainHeaderContent from './main-header-content';
import DropdownMenu from './dropdown-menu';
// Relative imports.
// import recordEvent from 'platform/monitoring/record-event';

export const Header = ({ /* showMegaMenu, */ showNavLogin }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Browser Out of Date Warning */}
      <BrowserDeprecationMessage />

      {/* Top mini banners, Veteran Crisis Line banner */}
      <HeaderBanners />

      {/* Main header */}
      <MainHeaderContent
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        showNavLogin={showNavLogin}
      />

      {/* Mega menu */}
      <DropdownMenu menuOpen={menuOpen} />
    </>
  );
};

Header.propTypes = {
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
