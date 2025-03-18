import React from 'react';
import { Route } from 'react-router-dom';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
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
 * Redirects to the introduction page
 * @returns {null}
 */
export const redirectToIntro = () => {
  if (typeof window !== 'undefined') {
    window.location.replace(INTRO_URL);
  }
  return null;
};

/**
 * Renders a component with required login view wrapper
 * @param {React.ComponentType} Component - The component to render
 * @param {Object} props - Component props
 * @returns {React.ReactElement}
 */
export const renderComponent = (Component, props) => {
  // Don't wrap introduction page with RequiredLoginView
  const currentPath = getCurrentPath();
  if (currentPath === INTRO_URL) {
    return (
      <Route {...props}>
        <Component {...props} />
      </Route>
    );
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
 * 1. The application is running in localhost environment (environment.isLocalhost)
 * 2. The route is the introduction page
 * 3. The ezr_route_guard_enabled feature toggle is disabled
 *
 * Development Mode Behavior:
 * - In localhost: all routes are accessible without authentication
 * - In other environments: authentication required if feature toggle is enabled
 * - Introduction page: always accessible in all environments
 *
 * @param {Object} route - The route to protect
 * @param {Object} state - The current Redux state (optional)
 * @returns {Object} The protected route object
 */
export const createProtectedRoute = (route, state) => {
  // Always allow access to introduction page
  if (route.path?.includes(content.routes.introduction)) {
    return route;
  }

  // Don't protect routes in localhost environment
  if (environment.isLocalhost()) {
    return route;
  }

  // Check if route guard feature is enabled via feature toggle
  const isEnabled = state
    ? toggleValues(state)[FEATURE_FLAG_NAMES.ezrRouteGuardEnabled]
    : true;

  // Skip protection if feature toggle is disabled
  if (!isEnabled) {
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
