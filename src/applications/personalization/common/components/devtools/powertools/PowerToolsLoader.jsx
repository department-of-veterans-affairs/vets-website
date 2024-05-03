import React, { Suspense } from 'react';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const LazyPowerToolsContainer = React.lazy(() =>
  import('./PowerToolsContainer'),
);

export const PowerToolsLoader = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profileUsePowerTools = useToggleValue(
    TOGGLE_NAMES.profileUsePowerTools,
  );
  return profileUsePowerTools ? (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyPowerToolsContainer />
    </Suspense>
  ) : null;
};
