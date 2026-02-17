import React, { useState } from 'react';
import { VaCrisisLineModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import LogoRow from '../LogoRow';
import Menu from '../../containers/Menu';
import OfficialGovtWebsite from '../OfficialGovtWebsite';

export const Header = ({ megaMenuData, showMegaMenu, showNavLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
      <OfficialGovtWebsite />
      <VaCrisisLineModal mode="trigger" />
      <nav className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
        <LogoRow
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
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
