import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

const withFeatureFlip = (Component, type) => {
  return props => {
    const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
    const featureToggles = useSelector(selectFeatureToggles);
    const {
      isLoadingFeatureFlags,
      isCovidVaccineTrialsIntakeEnabled,
      isCovidVaccineTrialsUpdateEnabled,
    } = featureToggles;
    if (isLoadingFeatureFlags) {
      return (
        <>
          <va-loading-indicator message="Loading your form" />
        </>
      );
    } else if (
      (type === 'update' && !isCovidVaccineTrialsUpdateEnabled) ||
      (type === 'intake-v2' && !isCovidVaccineTrialsIntakeEnabled)
    ) {
      // we could load an info page about the form being unavailable here
      window.location.replace('/coronavirus-research');
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
