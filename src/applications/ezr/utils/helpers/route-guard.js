import React from 'react';
import { Route } from 'react-router-dom';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import SignInModal from 'platform/user/authentication/components/SignInModal';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import environment from '~/platform/utilities/environment';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import content from '../../locales/en/content.json';

/**
 * Services required for the application to function.
 *
 * The list of services includes:
 * - FACILITIES: access to facilities data
 * - IDENTITY_PROOFED: user has completed identity proofing
 * - USER_PROFILE: user has a profile in the system
 *
 * Development Mode Behavior:
 * - In localhost environment (environment.isLocalhost), these service requirements
 *   are automatically bypassed to facilitate development and testing
 * - No URL parameters or manual configuration needed for local development
 * - Service requirements are enforced in all other environments
 */
export const serviceRequired = [
  backendServices.FACILITIES,
  backendServices.IDENTITY_PROOFED,
  backendServices.USER_PROFILE,
];

// Constants for URLs and paths
export const INTRO_URL = content.routes.introduction;
export const MHV_DASHBOARD_URL = '/my-health';
export const VERIFY_IDENTITY_URL = '/verify/';

/**
 * Validates if a component is a valid React component.
 * @param {React.ComponentType} component - The component to validate
 * @returns {boolean} True if component is valid
 */
export const isValidComponent = component =>
  component && typeof component === 'function';

/**
 * Gets the current path from window.location
 * @returns {string} The current path
 */
export const getCurrentPath = () =>
  typeof window !== 'undefined' ? window.location.pathname : '';

/**
 * Redirects to the specified URL
 * @param {string} url - The URL to redirect to
 * @returns {null}
 */
export const redirectTo = url => {
  if (typeof window !== 'undefined') {
    window.location.replace(url);
  }
  return null;
};

/**
 * Redirects to the introduction page
 * @returns {null}
 */
export const redirectToIntro = () => redirectTo(INTRO_URL);

/**
 * Helper function to check if the route guard feature is enabled
 *
 * @param {Object} state - Redux state or null
 * @param {boolean} defaultValue - Default value to return if state is null or toggle is not found
 * @returns {boolean} Whether the route guard feature is enabled
 */
export const checkRouteGuardEnabled = (state, defaultValue = true) => {
  if (!state) return defaultValue;
  return (
    toggleValues(state)[FEATURE_FLAG_NAMES.ezrRouteGuardEnabled] ?? defaultValue
  );
};

/**
 * Helper function to get the feature toggle status for debugging
 *
 * @param {Object} state - Redux state or null
 * @returns {string} The feature toggle status ('enabled', 'disabled', or 'unknown')
 */
export const getFeatureToggleStatus = state => {
  if (!state) return 'unknown';
  const enabled = toggleValues(state)[FEATURE_FLAG_NAMES.ezrRouteGuardEnabled];

  if (enabled === undefined) return 'unknown';
  return enabled ? 'enabled' : 'disabled';
};

/**
 * Renders the SignInModal component for user authentication
 * @param {Object} props - Props to pass to the SignInModal
 * @returns {React.ReactElement} SignInModal component
 */
export const renderSignInModal = (props = {}) => {
  const { onClose = () => {}, useSiS = true } = props;
  return <SignInModal visible onClose={onClose} useSiS={useSiS} />;
};

/**
 * Redirects to the sign-in page
 * @returns {React.ReactElement} SignInModal component
 */
export const redirectToSignIn = () => renderSignInModal();

/**
 * Redirects to the MHV dashboard
 * @returns {null}
 */
export const redirectToMHVDashboard = () => redirectTo(MHV_DASHBOARD_URL);

/**
 * Redirects to the verify identity page
 * @returns {null}
 */
export const redirectToVerifyIdentity = () => redirectTo(VERIFY_IDENTITY_URL);

/**
 * Checks if the user has the required authentication level
 * @param {Object} user - The user object
 * @returns {boolean} True if the user is authenticated
 */
export const isUserAuthenticated = user => {
  return user?.profile?.verified;
};

/**
 * Checks if the user has LOA3 authentication
 * @param {Object} user - The user object
 * @returns {boolean} True if the user has LOA3
 */
export const isUserLOA3 = user => {
  return user?.profile?.verified && user?.profile?.loa?.current === 3;
};

/**
 * Checks if the user has preferred facility data
 * @param {Object} user - The user object
 * @returns {boolean} True if the user has preferred facility data
 */
export const hasPreferredFacility = user => {
  return !!user?.profile?.facilities?.length;
};

/**
 * Renders a component with required login view wrapper
 * @param {React.ComponentType} Component - The component to render
 * @param {Object} props - Component props
 * @returns {React.ReactElement}
 */
export const renderComponent = (Component, props) => {
  // Return null if user is not yet loaded
  if (!props.user) {
    return null;
  }

  return (
    <RequiredLoginView
      verify
      serviceRequired={serviceRequired}
      user={props.user}
    >
      <Route {...props}>
        <Component {...props} />
      </Route>
    </RequiredLoginView>
  );
};

/**
 * Creates a protected route object with authentication checks.
 *
 * Routes are protected by default except in the following cases:
 * 1. The application is running in localhost environment (environment.isLocalhost) and feature toggle is disabled
 * 2. The ezr_route_guard_enabled feature toggle is disabled
 *
 * Development Mode Behavior:
 * - In localhost: all routes are accessible without authentication when feature toggle is off
 * - In other environments: authentication required if feature toggle is enabled
 * - All pages, including introduction page, require authentication when feature toggle is enabled
 *
 * @param {Object} route - The route to protect
 * @returns {Object} The protected route object
 */
export const createProtectedRoute = route => {
  /**
   * Feature Toggle Check
   *
   * DEBUGGING TIP: When troubleshooting route protection issues:
   * 1. Check if the feature toggle is correctly set in Flipper Admin UI
   * 2. Uncomment the line below to use the checkRouteGuardEnabled() helper function
   * 3. Uncomment the console.log below to see the actual toggle value
   *
   * const isEnabled = checkRouteGuardEnabled();
   */

  // Use the environment module imported at the top of the file

  /**
   * DEBUGGING TIP: Uncomment the lines below to see the feature toggle state
   * This is helpful when diagnosing issues with route protection in localhost
   * Information includes:
   * - Whether the feature toggle is enabled
   * - Confirmation that we're in localhost
   * - Whether the Redux state exists
   * - The feature flag name being checked
   */
  if (environment.isLocalhost()) {
    /**
     * DEBUGGING TIP: To see the feature toggle status:
     * 1. Uncomment the isEnabled variable above
     * 2. Then uncomment the lines below
     *
     * // console.log('DEBUG route-guard.js:', {
     * //   isEnabled,
     * //   featureToggleStatus: getFeatureToggleStatus(),
     * //   isLocalhost: true,
     * //   featureFlagName: FEATURE_FLAG_NAMES.ezrRouteGuardEnabled,
     * // });
     */
  }

  // Don't protect routes when in localhost
  // This ensures a smooth local development experience
  if (environment.isLocalhost()) {
    return route;
  }

  // Don't try to wrap undefined components
  if (!route.component) {
    return route;
  }

  // Create a new route object with the wrapped component
  return {
    ...route,
    component: props => {
      // Don't wrap introduction page with RequiredLoginView
      const currentPath = getCurrentPath();
      if (currentPath === INTRO_URL) {
        return <route.component {...props} />;
      }

      // Check if route guard feature is enabled via feature toggle from props
      const routeGuardEnabled =
        props.isRouteGuardEnabled !== undefined
          ? props.isRouteGuardEnabled
          : true;

      // Don't protect routes when feature toggle is disabled and we're in localhost
      if (!routeGuardEnabled && environment.isLocalhost()) {
        return <route.component {...props} />;
      }

      // Return null if user is not yet loaded
      if (!props.user) {
        return null;
      }

      return (
        <RequiredLoginView
          verify
          serviceRequired={serviceRequired}
          user={props.user}
        >
          <route.component {...props} />
        </RequiredLoginView>
      );
    },
  };
};
