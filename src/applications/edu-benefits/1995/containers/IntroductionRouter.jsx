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

  // Check for ?rudisill=true URL parameter OR saved formData
  const urlParams = new URLSearchParams(window.location.search);
  const isRudisillFromUrl = urlParams.get('rudisill') === 'true';
  const isRudisillFromSave =
    sessionStorage.getItem('isRudisillFlow') === 'true';
  const isRudisillFlow = isRudisillFromUrl || isRudisillFromSave;

  // Set sessionStorage flag when entering Rudisill flow via URL parameter
  // This persists the flow state for the form pages after leaving intro
  useEffect(
    () => {
      if (isRudisillFromUrl && rerouteEnabled) {
        sessionStorage.setItem('isRudisillFlow', 'true');
      } else if (!isRudisillFromUrl && rerouteEnabled) {
        // Clear when visiting intro without parameter (allows navigation back to questionnaire)
        // Note: Save-in-progress will restore this via formData.isRudisillFlow in Form1995App
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
