import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
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
  const { formData, user } = useSelector(state => getIntroState(state));

  // Check if user has a saved form (save-in-progress will handle navigation)
  const hasSavedForm = user?.profile?.savedForms?.some(
    form => form.form === '22-1995',
  );

  // Check for ?rudisill=true URL parameter OR saved formData
  const urlParams = new URLSearchParams(window.location.search);
  const isRudisillFromUrl = urlParams.get('rudisill') === 'true';
  const isRudisillFromFormData = formData?.isRudisillFlow === true;

  // Set sessionStorage flag when entering Rudisill flow via URL parameter or formData
  // This persists the flow state for the form pages after leaving intro
  useEffect(
    () => {
      if ((isRudisillFromUrl || isRudisillFromFormData) && rerouteEnabled) {
        sessionStorage.setItem('isRudisillFlow', 'true');
      } else if (!isRudisillFromUrl && rerouteEnabled && !hasSavedForm) {
        // Clear sessionStorage when visiting intro without URL param
        // This allows users to return to questionnaire flow
        // Exception: Keep the flag if user has a saved form (save-in-progress)
        sessionStorage.removeItem('isRudisillFlow');
      }
    },
    [
      isRudisillFromUrl,
      isRudisillFromFormData,
      hasSavedForm,
      formData,
      rerouteEnabled,
    ],
  );

  if (isLoading || rerouteEnabled === undefined) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading feature settings..."
      />
    );
  }

  // Route based ONLY on URL parameter, not sessionStorage or formData
  // This allows users to return to questionnaire by visiting intro without ?rudisill=true
  if (isRudisillFromUrl && rerouteEnabled) {
    return <IntroductionPageUpdate {...props} />;
  }

  if (rerouteEnabled) {
    return <IntroductionPageRedirect {...props} />;
  }

  return <IntroductionPageUpdate {...props} />;
};

export default IntroductionRouter;
