import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { makeSelectFeatureToggles } from '../hooks/selectors';

const withFeatureFlip = Component => {
  return props => {
    const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
    const featureToggles = useSelector(selectFeatureToggles);
    const { isCheckInEnabled, isLoadingFeatureFlags } = featureToggles;
    if (isLoadingFeatureFlags) {
      return (
        <>
          <LoadingIndicator message="Loading your check in experience" />
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
