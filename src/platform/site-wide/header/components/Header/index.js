// Node modules.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import LogoRow from '../LogoRow';
import Menu from '../../containers/Menu';
import OfficialGovtWebsite from '../OfficialGovtWebsite';
import VeteranCrisisLine from '../VeteranCrisisLine';
import addFocusBehaviorToCrisisLineModal from '../../../accessible-VCL-modal';
import { addOverlayTriggers } from '../../../legacy/menu';

export const Header = ({ megaMenuData, showMegaMenu, showNavLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Start Veteran Crisis Line modal functionality.
    addFocusBehaviorToCrisisLineModal();
    addOverlayTriggers();
  }, []);

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
      {/* Official government website banner */}
      <OfficialGovtWebsite />

      {/* Veteran crisis line */}
      <VeteranCrisisLine id="header-crisis-line" />

      <nav className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
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
      </nav>
    </div>
  );
};

Header.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
