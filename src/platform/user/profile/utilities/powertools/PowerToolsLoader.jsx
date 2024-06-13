import React, { Suspense } from 'react';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { PluginProvider } from './plugin';

const LazyPowerToolsContainer = React.lazy(() =>
  import('./PowerToolsContainer'),
);

export const PowerToolsLoader = ({ plugin = null }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const profileUsePowerTools = useToggleValue(
    TOGGLE_NAMES.profileUsePowerTools,
  );
  return profileUsePowerTools ? (
    <Suspense fallback={<div>Loading...</div>}>
      <PluginProvider plugin={plugin}>
        <LazyPowerToolsContainer />
      </PluginProvider>
    </Suspense>
  ) : null;
};
