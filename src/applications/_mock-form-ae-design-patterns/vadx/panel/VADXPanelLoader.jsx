import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import environment from 'platform/utilities/environment';

import { PluginProvider } from './Plugin';

const LazyPanel = React.lazy(() => import('./Panel'));

/**
 * VADXPanelLoader is a higher order component that loads the VADX panel
 * It checks if the feature toggle is enabled and the environment is localhost
 * This is to prevent the panel from being loaded in production and staging for now
 *
 * @param {object} plugin - A plugin component to be used as a tab within the VADX panel (WIP)
 * @param {string} featureToggleName - The feature toggle name to check if the panel should be shown
 * @returns {React.ReactNode | null} The VADX panel or null if the panel should not be shown
 */
export const VADXPanelLoader = ({ plugin = null, featureToggleName }) => {
  const { useToggleValue } = useFeatureToggle();

  try {
    const shouldShowViaToggle = useToggleValue(featureToggleName);
    const shouldShowViaEnv = environment.isLocalhost;

    return shouldShowViaToggle && shouldShowViaEnv ? (
      <Suspense fallback={<div>Loading...</div>}>
        <PluginProvider plugin={plugin}>
          <LazyPanel />
        </PluginProvider>
      </Suspense>
    ) : null;
  } catch (error) {
    // explicitly going to require a featureToggleName to be provided so that teams can manage their own VADX instances
    // eslint-disable-next-line no-console
    console.warn(
      `An error occurred while trying to load the VADX panel. Please check that the featureToggleName is correct. ${error}`,
    );
    return null;
  }
};

VADXPanelLoader.propTypes = {
  featureToggleName: PropTypes.string.isRequired,
  plugin: PropTypes.object,
};
