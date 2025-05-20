import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'platform/utilities/data/debounce';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { updateLayoutHeaderType } from 'platform/site-wide/layout/actions';
import { useSelector, useDispatch } from 'react-redux';
import { Header as MobileHeader } from '../Header';
import {
  hideDesktopHeader,
  showDesktopHeader,
  toggleMinimalHeader,
} from '../../helpers';
import MY_VA_LINK from '../../../mega-menu/constants/MY_VA_LINK';
import MY_HEALTH_LINK from '../../../mega-menu/constants/MY_HEALTH_LINK';

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
      showDesktopHeader();
    } else {
      hideDesktopHeader();
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
  const featureToggles = useSelector(state => toggleValues(state));
  const featureToggleMhvHeaderLinks = featureToggles.mhvHeaderLinks;
  const [headerState, setHeaderState] = useState(null);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= MOBILE_BREAKPOINT_PX,
  );
  const [updatedMegaMenuData, setUpdatedMegaMenuData] = useState(megaMenuData);

  useEffect(() => {
    const deriveIsDesktop = () =>
      setIsDesktop(window.innerWidth >= MOBILE_BREAKPOINT_PX);

    const onResize = debounce(100, deriveIsDesktop);

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(
    () => {
      if (featureToggleMhvHeaderLinks) {
        setUpdatedMegaMenuData([...megaMenuData, MY_VA_LINK, MY_HEALTH_LINK]);
      } else {
        setUpdatedMegaMenuData(megaMenuData);
      }
    },
    [megaMenuData, featureToggleMhvHeaderLinks],
  );

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

  return (
    <MobileHeader
      megaMenuData={updatedMegaMenuData}
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
