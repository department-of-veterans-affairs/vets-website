import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import environment from '~/platform/utilities/environment';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { selectAuthStatus } from '../utils/selectors/auth-status';
import {
  isValidComponent,
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
 * 2. Environment check - if running in localhost environment, bypasses remaining checks
 * 3. User state validation - checks user object and loading state
 * 4. Route validation - ensures the route exists and is accessible
 * 5. Authentication checks:
 *    - User must be logged in
 *    - User must be LOA3
 *    - User must be verified
 *
 * Notes:
 * - In localhost environment, authentication checks are bypassed only when the feature toggle is off
 * - In all other environments (dev, staging, production, review instances), authentication is always enforced
 * - The introduction page is always accessible without authentication
 * - Invalid or non-existent routes will redirect to the introduction page
 * - If any check fails, the user is redirected to the introduction page
 *
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.component - The component to wrap with authentication checks
 * @param {Object} props.user - The user object from the Redux store
 * @param {Object} props.rest - Additional props passed to the component
 * @returns {React.ReactElement|null} The rendered component or null
 */
const AuthenticatedRoute = ({ component: Component, user, ...rest }) => {
  const { isUserLOA3 } = useSelector(selectAuthStatus);
  const featureFlags = useSelector(toggleValues);
  const isRouteGuardEnabled =
    featureFlags[FEATURE_FLAG_NAMES.ezrRouteGuardEnabled];

  // Validate component first - if invalid, log error and return null
  if (!isValidComponent(Component)) {
    recordEvent({
      event: 'ezr-error',
      'error-key': 'invalid-component-prop',
      'error-message': 'AuthenticatedRoute received invalid component prop',
    });
    return null;
  }

  // Only bypass guards in localhost, not in dev or review instances
  // This ensures that Review Instances and other higher environments enforce authentication
  const disableGuards = environment.isLocalhost() && !isRouteGuardEnabled;

  // Get current path for intro page check
  const currentPath = getCurrentPath();

  // Bypass auth checks in any of these cases:
  // 1. Guards are disabled (only in localhost AND when feature toggle is off)
  // 2. Current path is the intro page
  if (disableGuards || currentPath === INTRO_URL) {
    return <Component {...rest} />;
  }

  // Check for loading states
  if (!user?.profile) {
    return null;
  }

  // Check authentication requirements
  const isAuthenticated = user.profile.verified && isUserLOA3;

  // Redirect if not authenticated, otherwise render protected component
  return isAuthenticated
    ? renderComponent(Component, { ...rest, user })
    : redirectToIntro();
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default AuthenticatedRoute;
