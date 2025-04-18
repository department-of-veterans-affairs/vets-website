import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const isCustomLoginEnabled = () => {
  // Always enable in localhost for development/testing
  if (environment.isLocalhost()) {
    return true;
  }

  // Check window.__REDUX_STATE__ if available
  try {
    if (window.__REDUX_STATE__?.featureToggles) {
      return !!window.__REDUX_STATE__.featureToggles
        .accreditedRepresentativePortalCustomLogin;
    }
  } catch (e) {
    return false;
  }

  return false;
};
