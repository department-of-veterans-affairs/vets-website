import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const isCustomLoginEnabled = () => {
  // Always enable in localhost for development/testing
  if (environment.isLocalhost()) {
    return true;
  }

  // Use properly initialized Redux store when available
  try {
    if (window.__REDUX_STATE__?.featureToggles) {
      return !!window.__REDUX_STATE__.featureToggles[
        FEATURE_FLAG_NAMES.accreditedRepresentativePortalCustomLogin
      ];
    }
  } catch (e) {
    return false;
  }

  return false;
};
