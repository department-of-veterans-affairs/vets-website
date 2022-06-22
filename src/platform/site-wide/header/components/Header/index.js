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
import { isBrowserIE } from '~/platform/site-wide/helpers/detection/is-browser';
import { useOnLoaded } from '~/platform/site-wide/hooks/events/use-on-loaded';

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
          <va-banner
            headline="You'll need to use a different web browser"
            show-close
            type="warning"
            visible
          >
            You’re using Internet Explorer right now to access VA.gov. Microsoft
            stopped supporting all versions of this browser on June 15, 2022.
            This means that you’ll need to switch to another browser, like
            Microsoft Edge, Google Chrome, Mozilla Firefox, or Apple Safari.
          </va-banner>
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
