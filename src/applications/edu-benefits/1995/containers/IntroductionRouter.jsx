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

  // Check for ?rudisill=true URL parameter OR saved formData OR sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const isRudisillFromUrl = urlParams.get('rudisill') === 'true';
  const isRudisillFromFormData = formData?.isRudisillFlow === true;
  const isRudisillFromSession =
    sessionStorage.getItem('isRudisillFlow') === 'true';
  const isRudisillFlow =
    isRudisillFromUrl || isRudisillFromFormData || isRudisillFromSession;

  // Set sessionStorage flag when entering Rudisill flow via URL parameter or formData
  // This persists the flow state for the form pages after leaving intro
  useEffect(
    () => {
      if ((isRudisillFromUrl || isRudisillFromFormData) && rerouteEnabled) {
        sessionStorage.setItem('isRudisillFlow', 'true');
      } else if (
        !isRudisillFromUrl &&
        !isRudisillFromFormData &&
        rerouteEnabled &&
        (!hasSavedForm || formData?.isRudisillFlow !== true)
      ) {
        // Clear sessionStorage when visiting intro without URL param or formData flag
        // This allows users to return to questionnaire flow after hard refresh
        // Exception: Keep the flag if user has a saved form with isRudisillFlow
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
