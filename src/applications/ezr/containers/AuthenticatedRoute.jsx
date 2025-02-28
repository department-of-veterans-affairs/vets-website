import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import {
  isValidComponent,
  checkDevModeGuards,
  redirectToIntro,
  renderComponent,
  getCurrentPath,
  INTRO_URL,
} from '../utils/helpers/route-guard';

/**
 * Higher-order component that wraps a route with authentication checks.
 *
 * This component takes a React component as a prop and returns a new component
 * that wraps the original component with authentication checks.
 *
 * The checks are performed in the following order:
 * 1. Component validation - ensures the component prop is a valid React component
 * 2. Development mode check - if enabled with ?disableRouteGuards=true, bypasses remaining checks
 * 3. User state validation - checks user object and loading state
 * 4. Route validation - ensures the route exists and is accessible
 * 5. Authentication checks:
 *    - User must be logged in
 *    - User must be LOA3
 *    - User must be verified
 *
 * Notes:
 * - In development mode, the ?disableRouteGuards=true flag bypasses auth checks
 * - The introduction page is always accessible without authentication
 * - Invalid or non-existent routes will redirect to the introduction page
 * - If any check fails, the user is redirected to the introduction page
 *
 * @param {React.ComponentType} component - The component to wrap with authentication checks
 * @param {Object} user - The user object from the Redux store
 * @param {Object} rest - Additional props passed to the component
 */

const AuthenticatedRoute = ({ component: Component, user, ...rest }) => {
  const { isUserLOA3 } = useSelector(selectAuthStatus);

  // Ensure Component is a valid React component first
  if (!isValidComponent(Component)) {
    recordEvent({
      event: 'ezr-error',
      'error-key': 'invalid-component-prop',
      'error-message': 'AuthenticatedRoute received invalid component prop',
    });
    return null;
  }

  // Check for dev mode and URL flag before any auth checks
  const disableGuards = checkDevModeGuards();

  /* istanbul ignore next */
  /**
   * Debug logging for authentication and redirect issues.
   * Uncomment this block to see detailed information about the current state
   * when investigating authentication or routing problems.
   *
   * Logged information includes:
   * - Development mode status
   * - URL parameters and route guard status
   * - Current route path and full URL
   * - Component validity
   * - User authentication state (LOA3, profile, verification)
   *
   * This is particularly useful when:
   * 1. Authentication checks are failing unexpectedly
   * 2. Routes are not being protected as expected
   * 3. Redirects are happening at unexpected times
   * 4. The dev mode route guard toggle isn't working
   */
  // console.log('[DEBUG] AuthenticatedRoute.jsx check:', {
  //   devMode: process.env.NODE_ENV === 'development',
  //   urlParams: window?.location?.search,
  //   disableGuards,
  //   pathname: window?.location?.pathname,
  //   component: !!Component,
  //   isUserLOA3,
  //   windowLocation: window?.location?.toString(),
  //   env: process.env.NODE_ENV,
  //   userProfile: user?.profile ? 'exists' : 'missing',
  //   userVerified: user?.profile?.verified,
  // });

  // In dev mode with flag, bypass ALL auth checks immediately
  if (disableGuards) {
    return <Component {...rest} />;
  }

  // Check for loading states
  if (!user || !user.profile) {
    return null;
  }

  const currentPath = getCurrentPath();

  // Don't check auth for intro page
  if (currentPath === INTRO_URL) {
    return <Component {...rest} />;
  }

  // Check profile verification and LOA3 last
  if (!user.profile.verified || !isUserLOA3) {
    return redirectToIntro();
  }

  // If authenticated, render the protected component
  return renderComponent(Component, { ...rest, user });
};

export default AuthenticatedRoute;

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
