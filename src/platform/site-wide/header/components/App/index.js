import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import Header from '../Header';
import { hideDesktopHeader, showDesktopHeader } from '../../helpers';

const MOBILE_BREAKPOINT_PX = 768;

export const App = ({ megaMenuData, show, showMegaMenu, showNavLogin }) => {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );

  const deriveIsDesktop = () =>
    setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);

  useEffect(() => {
    recordEvent({
      event: 'phased-roll-out-enabled',
      'product-description': 'Header V2',
    });

    window.addEventListener('resize', deriveIsDesktop);

    return () => window.removeEventListener('resize', deriveIsDesktop);
  }, []);

  if (!show) {
    return null;
  }

  if (isDesktop) {
    showDesktopHeader();
    return null;
  }

  hideDesktopHeader();

  return (
    <Header
      megaMenuData={megaMenuData}
      showMegaMenu={showMegaMenu}
      showNavLogin={showNavLogin}
    />
  );
};

App.propTypes = {
  megaMenuData: PropTypes.arrayOf(PropTypes.object).isRequired,
  show: PropTypes.bool.isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
};

export default App;
