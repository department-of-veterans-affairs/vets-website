import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import DesktopHeader from './partials/desktop/header';
import MobileHeader from './partials/mobile/header';

const MOBILE_BREAKPOINT_PX = 768;

const Header = ({ megaMenuData }) => {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );

  useEffect(() => {
    const deriveIsDesktop = () =>
      setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);

    const serveHeader = debounce(deriveIsDesktop, 100);

    window.addEventListener('resize', serveHeader);

    return () => {
      window.removeEventListener('resize', serveHeader);
    };
  }, []);

  return isDesktop ? (
    <DesktopHeader isDesktop={isDesktop} megaMenuData={megaMenuData} />
  ) : (
    <MobileHeader isDesktop={isDesktop} megaMenuData={megaMenuData} />
  );
};

Header.propTypes = {
  megaMenuData: PropTypes.array.isRequired,
};

export default Header;
