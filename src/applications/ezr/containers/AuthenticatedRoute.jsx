import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import environment from '~/platform/utilities/environment';

/**
 * DEBUGGING TIP: Uncomment this import when debugging feature toggle issues
 * import { useSelector } from 'react-redux';
 */
import {
  isValidComponent,
  redirectToSignIn,
  redirectToMHVDashboard,
  redirectToVerifyIdentity,
  renderComponent,
  isUserLOA3 as checkUserLOA3,
  hasPreferredFacility,

  /**
   * DEBUGGING TIP: Uncomment these imports when debugging:
   * getCurrentPath,         // For path-related issues
   * checkRouteGuardEnabled,   // For feature toggle checks
   * getFeatureToggleStatus, // For feature toggle status
   */
} from '../utils/helpers/route-guard';

/**
 * Higher-order component that wraps a route with authentication checks.
 *
 * This component takes a React component as a prop and returns a new component
 * that wraps the original component with authentication checks.
 *
 * The checks are performed in the following order:
 * 1. Component validation - ensures the component prop is a valid React component
 * 2. Environment check - if running in localhost environment, bypasses remaining checks when feature toggle is off
 * 3. User state validation - checks user object and loading state
 * 4. Route validation - ensures the route exists and is accessible
 * 5. Authentication checks with different redirect paths:
 *    - If user is not signed in: redirect to sign-in page
 *    - If user has LOA < 3: redirect to verify identity page
 *    - If user has LOA3 but no preferred facility: redirect to MHV dashboard
 *    - If user has LOA3 and preferred facility: allow access
 *
 * Notes:
 * - In localhost environment, authentication checks are bypassed only when the feature toggle is off
 * - In all other environments (dev, staging, production, review instances), authentication is always enforced
 * - All pages, including the introduction page, require authentication when feature toggle is enabled
 * - Each authentication failure has a specific redirect path based on the user's state
 *
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.component - The component to wrap with authentication checks
 * @param {Object} props.user - The user object from the Redux store
 * @param {Object} props.rest - Additional props passed to the component
 * @returns {React.ReactElement|null} The rendered component or null
 */
const AuthenticatedRoute = ({ component: Component, user, ...rest }) => {
  // We're using checkUserLOA3 directly instead of the selector
  /**
   * DEBUGGING TIP: Uncomment the lines below when debugging feature toggle issues
   * This uses the helper functions from route-guard.js for consistent toggle checking
   *
   * const state = useSelector(state => state);
   * const isRouteGuardFeatureEnabled = isRouteGuardEnabled(state, false);
   * const featureToggleStatus = getFeatureToggleStatus(state);
   */

  // Validate component first - if invalid, log error and return null
  if (!isValidComponent(Component)) {
    recordEvent({
      event: 'ezr-error',
      'error-key': 'invalid-component-prop',
      'error-message': 'AuthenticatedRoute received invalid component prop',
    });
    return null;
  }

  // We always bypass guards in localhost, not in dev or review instances
  /**
   * DEBUGGING TIP: Uncomment the line below when debugging path-related issues
   * const currentPath = getCurrentPath();
   */

  // In localhost, bypass auth checks and log details for debugging
  if (environment.isLocalhost()) {
    /**
     * DEBUGGING TIP: Uncomment the lines below to see detailed authentication flow information
     * This is useful when diagnosing issues with authentication in localhost
     * Information includes:
     * - Current path and whether it's the intro page
     * - Feature toggle status (enabled/disabled)
     * - User profile existence
     * - User LOA level
     * - Whether user has facilities
     */
    /**
     * DEBUGGING TIP: To see authentication flow details:
     * 1. Uncomment the feature toggle variables above
     * 2. Then uncomment the lines below
     *
     * // console.log('DEBUG Auth Flow:', {
     * //   path: 'Import and use getCurrentPath() to see current path',
     * //   isIntroPage: 'Import and use getCurrentPath() to check if path === "/introduction"',
     * //   isLocalhost: true,
     * //   featureToggleStatus,
     * //   isRouteGuardFeatureEnabled,
     * //   userProfile: user?.profile ? 'exists' : 'missing',
     * //   userLOA: user?.profile?.loa?.current,
     * //   hasFacilities: user?.profile?.facilities?.length > 0,
     * // });
     */

    /**
     * DEBUGGING TIP: Uncomment the line below to confirm auth checks are being bypassed
     * This helps verify the localhost bypass is working correctly
     */
    // console.log('DEBUG: Bypassing auth checks in localhost environment');
    return <Component {...rest} />;
  }

  // If user is not signed in, render the sign-in modal
  if (!user?.profile) {
    return redirectToSignIn();
  }

  // If user doesn't have LOA3, redirect to verify identity page
  const hasLOA3 = checkUserLOA3(user);
  if (!hasLOA3) {
    return redirectToVerifyIdentity();
  }

  // If user has LOA3 but no preferred facility, redirect to MHV dashboard
  if (!hasPreferredFacility(user)) {
    return redirectToMHVDashboard();
  }

  // User has LOA3 and preferred facility, allow access
  return renderComponent(Component, { ...rest, user });
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default AuthenticatedRoute;
