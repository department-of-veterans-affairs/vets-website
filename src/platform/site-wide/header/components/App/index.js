import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { updateLayoutHeaderType } from 'platform/site-wide/layout/actions';
import { useSelector, useDispatch } from 'react-redux';
import MobileHeader from '../Header';
import {
  hideLegacyHeader,
  showLegacyHeader,
  toggleMinimalHeader,
} from '../../helpers';

const MOBILE_BREAKPOINT_PX = 768;

export const App = ({
  megaMenuData,
  show,
  showMegaMenu,
  showNavLogin,
  showMinimalHeader,
}) => {
  const dispatch = useDispatch();
  const path = useSelector(state => state?.navigation?.route?.path);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );
  const prevHeaderState = useRef(null);
  const isMinimalHeaderApplicable = !!showMinimalHeader;

  let headerState = 'default';
  if (!show) {
    headerState = 'none';
  } else if (isMinimalHeaderApplicable && showMinimalHeader(path)) {
    headerState = 'minimal';
  } else if (!isDesktop) {
    headerState = 'mobile';
  }

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

  if (prevHeaderState.current !== headerState) {
    prevHeaderState.current = headerState;

    if (show) {
      if (isMinimalHeaderApplicable) {
        toggleMinimalHeader(headerState === 'minimal');
      }
      if (isDesktop) {
        showLegacyHeader();
      } else {
        hideLegacyHeader();
      }
    }

    dispatch(updateLayoutHeaderType(headerState));
  }

  if (!show || headerState === 'minimal' || headerState === 'default') {
    // don't show MobileHeader
    return null;
  }

  return (
    <MobileHeader
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
  showMinimalHeader: PropTypes.func,
};

export default App;
