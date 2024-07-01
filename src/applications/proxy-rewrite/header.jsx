import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import DesktopHeader from './partials/desktop/header';
// import { getMobileHeader } from './partials/mobile/header';

const MOBILE_BREAKPOINT_PX = 768;

const Header = ({ megaMenuData }) => {
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );

  useEffect(() => {
    const deriveIsDesktop = () => setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);
    const onResize = debounce(deriveIsDesktop, 100);

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <DesktopHeader megaMenuData={megaMenuData} />;
};

export default Header;