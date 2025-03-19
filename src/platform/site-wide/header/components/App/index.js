import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'platform/utilities/data/debounce';
import { updateLayoutHeaderType } from 'platform/site-wide/layout/actions';
import { useSelector, useDispatch } from 'react-redux';
import {
  isMinimalHeaderApp,
  isMinimalHeaderPath,
} from 'platform/forms-system/src/js/patterns/minimal-header';
import MobileHeader from '../Header';
import {
  hideDesktopHeader,
  showDesktopHeader,
  toggleMinimalHeader,
} from '../../helpers';

const MOBILE_BREAKPOINT_PX = 768;

function determineHeaderState(show, isMinimalHeader, isDesktop) {
  if (!show) {
    return 'none';
  }
  if (isMinimalHeader) {
    return 'minimal';
  }

  if (!isDesktop) {
    return 'mobile';
  }

  return 'default';
}

function setStaticHeaderDisplay(show, isMinimalHeader, headerState, isDesktop) {
  if (show) {
    if (isMinimalHeaderApp()) {
      toggleMinimalHeader(isMinimalHeader);
    }
    if (isDesktop) {
      showDesktopHeader();
    } else {
      hideDesktopHeader();
    }
  }
  // else everything is already hidden by default
}

export const App = ({ megaMenuData, show, showMegaMenu, showNavLogin }) => {
  const dispatch = useDispatch();
  const path = useSelector(state => state?.navigation?.route?.path);
  const [headerState, setHeaderState] = useState(null);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );
  const isMinimalHeader = useMemo(() => isMinimalHeaderPath(path), [path]);

  useEffect(() => {
    const deriveIsDesktop = () =>
      setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);

    const onResize = debounce(100, deriveIsDesktop);

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(
    () => {
      const newHeaderState = determineHeaderState(
        show,
        isMinimalHeader,
        isDesktop,
      );

      if (headerState !== newHeaderState) {
        setStaticHeaderDisplay(
          show,
          isMinimalHeader,
          newHeaderState,
          isDesktop,
        );
        setHeaderState(newHeaderState);
        dispatch(updateLayoutHeaderType(newHeaderState));
      }
    },
    [show, path, isDesktop, dispatch, headerState, isMinimalHeader],
  );

  if (!show || headerState !== 'mobile') {
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
  setupMinimalHeader: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  showMegaMenu: PropTypes.bool.isRequired,
  showNavLogin: PropTypes.bool.isRequired,
  showMinimalHeader: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};

export default App;
