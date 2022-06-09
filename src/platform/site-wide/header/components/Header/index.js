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
import { isBrowserIE } from '~/logic/detection/is-browser';
import { useOnLoaded } from '~/logic/hooks/events/use-on-loaded';

export const Header = ({ megaMenuData, showMegaMenu, showNavLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loaded = useOnLoaded(window);

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
      <VeteranCrisisLine />

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

      {/* Alert when the user's browser is Internet Explorer. */}
      {/* @TODO Wrap this web-component into its own react component. */}
      {loaded &&
        isBrowserIE() && (
          <va-alert
            close-btn-aria-label="Close notification"
            full-width
            status="warning"
            visible
          >
            <h3 slot="headline">
              Internet Explorer 11 will soon be unsupported
            </h3>
            <div>
              <p className="vads-u-margin-bottom--0 vads-u-padding--0">
                You will need to switch to use Chrome, Firefox, or Safari.
              </p>
            </div>
          </va-alert>
        )}
    </div>
  );
};

Header.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default Header;
