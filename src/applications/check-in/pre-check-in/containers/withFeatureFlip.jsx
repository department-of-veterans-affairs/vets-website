import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';

const withFeatureFlip = Component => {
  return props => {
    const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
    const featureToggles = useSelector(selectFeatureToggles);
    const { isLoadingFeatureFlags, isPreCheckInEnabled } = featureToggles;
    if (isLoadingFeatureFlags) {
      return (
        <>
          <va-loading-indicator message="Loading your pre check in experience" />
        </>
      );
    } else if (!isPreCheckInEnabled) {
      window.location.replace('/');
      return <></>;
    } else {
      return (
        <>
          <meta name="robots" content="noindex" />
          <Component {...props} {...featureToggles} />
        </>
      );
    }
  };
};

export default withFeatureFlip;
