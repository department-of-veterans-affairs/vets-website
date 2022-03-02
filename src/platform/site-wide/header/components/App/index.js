// Node modules.
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import Header from '../Header';
import { hideLegacyHeader, showLegacyHeader } from '../../helpers';

const MOBILE_BREAKPOINT_PX = 768;

export const App = ({ megaMenuData, show, showMegaMenu, showNavLogin }) => {
  // Derive if we are on desktop.
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );

  // Derive if we are on desktop and set isDesktop state.
  const deriveIsDesktop = () =>
    setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);

  useEffect(() => {
    // Record analytic event.
    recordEvent({
      event: 'phased-roll-out-enabled',
      'product-description': 'Header V2',
    });

    // Set screen size listener.
    window.addEventListener('resize', deriveIsDesktop);

    // Clear listener.
    return () => window.removeEventListener('resize', deriveIsDesktop);
  }, []);

  // Do not render if prop show is falsey.
  if (!show) {
    return null;
  }

  // Render the legacy header if we are on desktop.
  if (isDesktop) {
    showLegacyHeader();
    return null;
  }

  hideLegacyHeader();
  return (
    <Header
      megaMenuData={megaMenuData}
      showMegaMenu={showMegaMenu}
      showNavLogin={showNavLogin}
    />
  );
};

export default App;

App.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  show: PropTypes.bool.isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};
