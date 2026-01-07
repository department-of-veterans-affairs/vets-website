import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import IntroductionPageUpdate from './IntroductionPageUpdate';
import IntroductionPageRedirect from './IntroductionPageRedirect';
import { selectMeb1995Reroute } from '../selectors/featureToggles';

/**
 * Routes users to appropriate introduction page based on feature flag and URL parameters.
 *
 * Flow Logic:
 * - When meb1995Reroute is enabled:
 *   - Default: Shows IntroductionPageRedirect (questionnaire intro)
 *   - With ?rudisill=true: Shows IntroductionPageUpdate (legacy form intro)
 * - When meb1995Reroute is disabled: Always shows IntroductionPageUpdate (legacy form intro)
 *
 * Navigation behavior:
 * - URL parameter (?rudisill=true) determines which intro page is shown
 * - sessionStorage flag persists flow state for form pages after leaving intro
 * - Visiting intro without parameter clears sessionStorage, allowing return to questionnaire
 */
const IntroductionRouter = props => {
  const rerouteEnabled = useSelector(selectMeb1995Reroute);
  const { useToggleLoadingValue } = useFeatureToggle();
  const isLoading = useToggleLoadingValue();

  // Check for ?rudisill=true URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isRudisillFlow = urlParams.get('rudisill') === 'true';

  // Set sessionStorage flag when entering Rudisill flow via URL parameter
  // This persists the flow state for the form pages after leaving intro
  useEffect(
    () => {
      if (isRudisillFlow && rerouteEnabled) {
        sessionStorage.setItem('isRudisillFlow', 'true');
      } else if (!isRudisillFlow && rerouteEnabled) {
        // Only clear if we're on intro page without the parameter
        // This allows returning to questionnaire intro from Rudisill flow
        sessionStorage.removeItem('isRudisillFlow');
      }
    },
    [isRudisillFlow, rerouteEnabled],
  );

  if (isLoading || rerouteEnabled === undefined) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading feature settings..."
      />
    );
  }

  // If URL has ?rudisill=true and reroute flag is enabled, show legacy intro
  // This ensures intro page routing is based on current URL, not persisted state
  if (isRudisillFlow && rerouteEnabled) {
    return <IntroductionPageUpdate {...props} />;
  }

  if (rerouteEnabled) {
    return <IntroductionPageRedirect {...props} />;
  }

  return <IntroductionPageUpdate {...props} />;
};

export default IntroductionRouter;
