import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

const withFeatureFlip = (Component, options) => {
  const { isPreCheckIn } = options;
  return props => {
    const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
    const featureToggles = useSelector(selectFeatureToggles);
    const {
      isCheckInEnabled,
      isLoadingFeatureFlags,
      isPreCheckInEnabled,
    } = featureToggles;
    const appEnabled = isPreCheckIn ? isPreCheckInEnabled : isCheckInEnabled;

    if (!appEnabled && !isLoadingFeatureFlags) {
      window.location.replace('/');
      return <></>;
    }

    return (
      <>
        <meta name="robots" content="noindex" />
        {/* Allowing for HOC */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...props} {...featureToggles} />
      </>
    );
  };
};

export default withFeatureFlip;
