import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import IntroductionPageUpdate from './IntroductionPageUpdate';
import IntroductionPageRedirect from './IntroductionPageRedirect';
import { selectMeb1995Reroute } from '../selectors/featureToggles';

/**
 * Routes users to the appropriate introduction page based on feature flag and URL parameters.
 *
 * Routing Logic:
 * - meb1995Reroute enabled + no URL param: IntroductionPageRedirect (questionnaire)
 * - meb1995Reroute enabled + ?rudisill=true: IntroductionPageUpdate (legacy form for Rudisill)
 * - meb1995Reroute disabled: IntroductionPageUpdate (legacy form)
 *
 * State Management:
 * - URL parameter is the source of truth for intro page routing
 * - sessionStorage persists flow state for form pages (set when ?rudisill=true, cleared otherwise)
 * - Users can return to questionnaire by navigating to /introduction without ?rudisill=true
 */
const IntroductionRouter = props => {
  const rerouteEnabled = useSelector(selectMeb1995Reroute);
  const { useToggleLoadingValue } = useFeatureToggle();
  const isLoading = useToggleLoadingValue();

  // Check for ?rudisill=true URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isRudisillFromUrl = urlParams.get('rudisill') === 'true';

  // Check if we're on the introduction page (not a form page)
  const isOnIntroPage = window.location.pathname.endsWith('/introduction');

  // Manage sessionStorage flags for flow state
  // URL parameter is the source of truth for intro page routing
  // Only manage sessionStorage when on the introduction page to avoid clearing it on form pages
  useEffect(
    () => {
      if (!isOnIntroPage) {
        return;
      }

      if (isRudisillFromUrl && rerouteEnabled) {
        // Entering Rudisill flow via URL - set sessionStorage for form pages
        sessionStorage.setItem('isRudisillFlow', 'true');
      } else if (rerouteEnabled) {
        // No URL param - clear sessionStorage to ensure questionnaire flow
        // This handles both fresh visits and returns from Rudisill flow
        sessionStorage.removeItem('isRudisillFlow');
      }
    },
    [isOnIntroPage, isRudisillFromUrl, rerouteEnabled],
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
