import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { makeSelectFeatureToggles } from '../hooks/selectors';
import environment from 'platform/utilities/environment';

const withFeatureFlip = Component => {
  return props => {
    const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
    const featureToggles = useSelector(selectFeatureToggles);
    const { isLoadingFeatureFlags } = featureToggles;
    if (isLoadingFeatureFlags) {
      return (
        <>
          <LoadingIndicator message="Loading your pre check in experience" />
        </>
      );
    } else if (environment.isProduction()) {
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
