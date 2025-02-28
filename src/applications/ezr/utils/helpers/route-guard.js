import React from 'react';
import { Route } from 'react-router-dom';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import content from '../../locales/en/content.json';

/**
 * Services required for the application to function.
 *
 * The list of services includes:
 * - FACILITIES: access to facilities data
 * - IDENTITY_PROOFED: user has completed identity proofing
 * - USER_PROFILE: user has a profile in the system
 *
 * If any of these services are not available, the application will not function.
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
 * Checks if route guards should be disabled in development mode
 * @returns {boolean} True if guards should be disabled
 */
export const checkDevModeGuards = () => {
  const devMode = process.env.NODE_ENV === 'development';
  const urlParams = new URLSearchParams(window?.location?.search || '');
  return devMode && urlParams.has('disableRouteGuards');
};

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
 * Creates a protected route object with authentication checks
 * @param {Object} route - The route to protect
 * @returns {Object} The protected route object
 */
export const createProtectedRoute = route => {
  const disableGuards = checkDevModeGuards();

  // Don't protect routes if guards are disabled or it's the introduction page
  if (disableGuards || route.path?.includes(content.routes.introduction)) {
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
