import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import DesktopHeader from './partials/desktop/header';
import MobileHeader from './partials/mobile/header';
import SignInModal from './partials/sign-in';

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

  const header = isDesktop ? (
    <DesktopHeader megaMenuData={megaMenuData} />
  ) : (
    <MobileHeader megaMenuData={megaMenuData} />
  );

  return (
    <>
      {header}
      <div id="ts-login-modal-container">
        <SignInModal />
      </div>
    </>
  );
};

Header.propTypes = {
  megaMenuData: PropTypes.array.isRequired,
};

export default Header;
