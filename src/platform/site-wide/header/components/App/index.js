import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import debounce from 'platform/utilities/data/debounce';
import { updateLayoutHeaderType } from 'platform/site-wide/layout/actions';
import { useSelector, useDispatch } from 'react-redux';
import MobileHeader from '../Header';
import {
  hideLegacyHeader,
  showLegacyHeader,
  toggleMinimalHeader,
} from '../../helpers';

const MOBILE_BREAKPOINT_PX = 768;

function determineHeaderState(show, showMinimalHeader, path, isDesktop) {
  if (!show) {
    return 'none';
  }
  if (
    showMinimalHeader &&
    (typeof showMinimalHeader === 'function'
      ? showMinimalHeader(path)
      : showMinimalHeader)
  ) {
    return 'minimal';
  }

  if (!isDesktop) {
    return 'mobile';
  }

  return 'default';
}

function setStaticHeaderDisplay(
  show,
  isMinimalHeaderApplicable,
  headerState,
  isDesktop,
) {
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
  // else everything is already hidden by default
}

export const App = ({
  megaMenuData,
  show,
  showMegaMenu,
  showNavLogin,
  showMinimalHeader,
}) => {
  const dispatch = useDispatch();
  const path = useSelector(state => state?.navigation?.route?.path);
  const [headerState, setHeaderState] = useState(null);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );

  useEffect(() => {
    const deriveIsDesktop = () =>
      setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);

    const onResize = debounce(100, deriveIsDesktop);

    recordEvent({
      event: 'phased-roll-out-enabled',
      'product-description': 'Header V2',
    });

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(
    () => {
      const newHeaderState = determineHeaderState(
        show,
        showMinimalHeader,
        path,
        isDesktop,
      );

      if (headerState !== newHeaderState) {
        setStaticHeaderDisplay(
          show,
          showMinimalHeader,
          newHeaderState,
          isDesktop,
        );
        setHeaderState(newHeaderState);
        dispatch(updateLayoutHeaderType(newHeaderState));
      }
    },
    [show, showMinimalHeader, path, isDesktop, dispatch, headerState],
  );

  if (!show || headerState !== 'mobile') {
    return null;
  }

<<<<<<< HEAD
=======
  if (isDesktop) {
    showDesktopHeader();
    return null;
  }

  hideDesktopHeader();

>>>>>>> bab4c82fd3 (VACMS-16815 Separate header and footer for TeamSites)
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
  showMinimalHeader: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};

export default App;
