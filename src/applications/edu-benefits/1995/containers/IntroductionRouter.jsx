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
  const isRudisillFromUrl = urlParams.get('rudisill') === 'true';

  // Manage sessionStorage flags for flow state
  // URL parameter is the source of truth for intro page routing
  useEffect(
    () => {
      if (isRudisillFromUrl && rerouteEnabled) {
        // Entering Rudisill flow via URL - set sessionStorage for form pages
        sessionStorage.setItem('isRudisillFlow', 'true');
      } else if (rerouteEnabled) {
        // No URL param - clear sessionStorage to ensure questionnaire flow
        // This handles both fresh visits and returns from Rudisill flow
        sessionStorage.removeItem('isRudisillFlow');
      }
    },
    [isRudisillFromUrl, rerouteEnabled],
  );

  if (isLoading || rerouteEnabled === undefined) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading feature settings..."
      />
    );
  }

  // Route intro page based on URL parameter ONLY (not sessionStorage)
  // This allows users to return to questionnaire by visiting /introduction without ?rudisill=true
  // sessionStorage is still used by form pages to know which flow they're in
  if (isRudisillFromUrl && rerouteEnabled) {
    return <IntroductionPageUpdate {...props} />;
  }

  if (rerouteEnabled) {
    return <IntroductionPageRedirect {...props} />;
  }

  return <IntroductionPageUpdate {...props} />;
};

export default IntroductionRouter;
