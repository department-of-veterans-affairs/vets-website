import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { PluginProvider } from './plugin';

const LazyPanel = React.lazy(() => import('./Panel'));

export const VADXPanelLoader = ({ plugin = null, featureToggleName }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const shouldShowVADX = useToggleValue(
    featureToggleName || TOGGLE_NAMES.profileUseExperimental,
  );
  if (!featureToggleName) {
    // eslint-disable-next-line no-console
    console.warn(
      'A unique featureToggleName should be used by your team when using the VADX tools. The `profile_use_experimental` toggle will be used as a fallback.',
    );
  }
  return shouldShowVADX ? (
    <Suspense fallback={<div>Loading...</div>}>
      <PluginProvider plugin={plugin}>
        <LazyPanel />
      </PluginProvider>
    </Suspense>
  ) : null;
};

VADXPanelLoader.propTypes = {
  featureToggleName: PropTypes.string,
  plugin: PropTypes.object,
};
