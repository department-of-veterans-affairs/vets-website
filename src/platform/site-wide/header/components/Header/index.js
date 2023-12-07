import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LogoRow from '../LogoRow';
import Menu from '../../containers/Menu';
import OfficialGovtWebsite from '../OfficialGovtWebsite';
import VeteranCrisisLine from '../VeteranCrisisLine';
import addFocusBehaviorToCrisisLineModal from '../../../accessible-VCL-modal';
import { addOverlayTriggers } from '../../../legacy/menu';

export const Header = ({
  isDesktop,
  megaMenuData,
  showMegaMenu,
  showNavLogin,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [canShowLoginModal, setCanShowLoginModal] = useState(true);

  useEffect(() => {
    addFocusBehaviorToCrisisLineModal();
    addOverlayTriggers(setCanShowLoginModal);
  }, []);

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
      <OfficialGovtWebsite />
      <VeteranCrisisLine id="header-crisis-line" />
      <nav className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
        <LogoRow
          canShowLoginModal={canShowLoginModal}
          isDesktop={isDesktop}
          isMenuOpen={isMenuOpen}
          showNavLogin={showNavLogin}
          setIsMenuOpen={setIsMenuOpen}
        />
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
  isDesktop: PropTypes.bool.isRequired,
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
