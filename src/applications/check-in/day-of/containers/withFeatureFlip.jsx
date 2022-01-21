import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';

const withFeatureFlip = Component => {
  return props => {
    const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
    const featureToggles = useSelector(selectFeatureToggles);
    const { isCheckInEnabled, isLoadingFeatureFlags } = featureToggles;
    if (isLoadingFeatureFlags) {
      return (
        <>
          <va-loading-indicator message="Loading your check in experience" />
        </>
      );
    } else if (!isCheckInEnabled) {
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
