// Node modules.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import LogoRow from '../LogoRow';
import Menu from '../../containers/Menu';
import OfficialGovtWebsite from '../OfficialGovtWebsite';
import VeteranCrisisLine from '../VeteranCrisisLine';

export const Header = ({ megaMenuData, showMegaMenu, showNavLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0"
      role="banner"
    >
      {/* Official government website banner */}
      <OfficialGovtWebsite />

      {/* Veteran crisis line */}
      <VeteranCrisisLine />

      {/* Logo row */}
      <LogoRow
        isMenuOpen={isMenuOpen}
        showNavLogin={showNavLogin}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Menu */}
      <Menu
        isMenuOpen={isMenuOpen}
        megaMenuData={megaMenuData}
        showMegaMenu={showMegaMenu}
      />
    </header>
  );
};

Header.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
