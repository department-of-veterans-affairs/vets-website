import React from 'react';
import { Route } from 'react-router-dom';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import environment from '~/platform/utilities/environment';
import content from '../../locales/en/content.json';

/**
 * Services required for the application to function.
 *
 * The list of services includes:
 * - FACILITIES: access to facilities data
 * - IDENTITY_PROOFED: user has completed identity proofing
 * - USER_PROFILE: user has a profile in the system
 *
 * Note: These requirements are automatically bypassed in localhost environment
 * to facilitate development and testing.
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
 * Routes are protected by default except in two cases:
 * 1. The application is running in localhost environment (for development)
 * 2. The route is the introduction page
 *
 * @param {Object} route - The route to protect
 * @returns {Object} The protected route object
 */
export const createProtectedRoute = route => {
  // Don't protect routes if environment is Localhost or it's the introduction page
  if (
    environment.isLocalhost ||
    route.path?.includes(content.routes.introduction)
  ) {
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
