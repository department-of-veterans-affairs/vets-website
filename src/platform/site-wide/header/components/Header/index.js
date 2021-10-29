// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import './styles.scss';
import LogoRow from '../LogoRow';
import OfficialGovtWebsite from '../OfficialGovtWebsite';
import VeteranCrisisLine from '../VeteranCrisisLine';

export const Header = () => {
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
      <LogoRow />
    </header>
  );
};

Header.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
