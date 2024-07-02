import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import DesktopHeader from './partials/desktop/header';
import MobileHeader from './partials/mobile/header';
import { addHeaderEventListeners } from './utilities/menu-behavior';

const MOBILE_BREAKPOINT_PX = 768;

const Header = ({ megaMenuData }) => {
  const [vclModalIsOpen, setVclModalIsOpen] = useState(false);
  const [signInModalIsOpen, setSignInModalIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );

  useEffect(() => {
    const deriveIsDesktop = () => setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);
    const serveHeader = debounce(deriveIsDesktop, 100);
    const addListeners = debounce(addHeaderEventListeners, 100);
    
    window.addEventListener('resize', serveHeader);

    return () => {
      window.removeEventListener('resize', serveHeader);
      window.removeEventListener('resize', addListeners);
    };
  }, []);

  useEffect(() => {
    addHeaderEventListeners();
  }, [isDesktop]);

  return isDesktop ?
    (
      <DesktopHeader
        megaMenuData={megaMenuData}
        setSignInModalIsOpen={setSignInModalIsOpen}
        setVclModalIsOpen={setVclModalIsOpen}
        signInModalIsOpen={signInModalIsOpen}
        vclModalIsOpen={vclModalIsOpen}
      />
    ) :
    (
      <MobileHeader
        megaMenuData={megaMenuData}
        setSignInModalIsOpen={setSignInModalIsOpen}
        setVclModalIsOpen={setVclModalIsOpen}
        signInModalIsOpen={signInModalIsOpen}
        vclModalIsOpen={vclModalIsOpen}
      />
    );
};

export default Header;