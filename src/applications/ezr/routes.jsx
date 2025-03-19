import React from 'react';
import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';
import { connect } from 'react-redux';
import environment from '~/platform/utilities/environment';
import formConfig from './config/form';
import App from './containers/App';
import AuthenticatedRoute from './containers/AuthenticatedRoute';
import { createProtectedRoute } from './utils/helpers/route-guard';

// Import the helper functions for feature toggle checks
/**
 * DEBUGGING TIP: Uncomment these imports when debugging feature toggle issues
 * import { checkRouteGuardEnabled, getFeatureToggleStatus } from './utils/helpers/route-guard';
 */

/**
 * Maps state to props for the ConnectedAuthRoute component.
 *
 * This function extracts the user object from the state and passes it as a prop
 * to the ConnectedAuthRoute component, enabling access to user information
 * throughout the component tree.
 *
 * @param {Object} state - The current state of the Redux store.
 * @returns {Object} An object containing the user prop.
 */
const ConnectedAuthRoute = connect(state => ({
  user: state.user,
}))(AuthenticatedRoute);

/**
 * Wraps a component with authentication using ConnectedAuthRoute.
 *
 * This higher-order component is used to ensure that the given component
 * is rendered with authentication checks. It passes the component as a prop
 * to ConnectedAuthRoute, along with any additional props.
 *
 * @param {React.ComponentType} Component - The component to wrap with authentication.
 * @returns {React.ComponentType} A new component wrapped with authentication.
 */
const wrapWithAuth = Component => props => (
  <ConnectedAuthRoute {...props} component={Component} />
);

// Use createProtectedRoute from route-guard.js
const protectedRouteWithAuth = (route, state) => {
  /**
   * Feature Toggle Check
   *
   * DEBUGGING TIP: When troubleshooting route protection issues:
   * 1. Check if the feature toggle is correctly set in Flipper Admin UI
   * 2. Uncomment the imports at the top of this file
   * 3. Uncomment the code below to use the helper functions
   * 4. Uncomment the console.log below to see the actual toggle value
   *
   * const isEnabled = checkRouteGuardEnabled(state);
   * const featureToggleStatus = getFeatureToggleStatus(state);
   */

  // Don't protect routes when in localhost environment
  // This ensures a smooth local development experience
  if (environment.isLocalhost()) {
    /**
     * DEBUGGING TIP: To see the feature toggle status:
     * 1. Uncomment the featureToggleStatus variable above
     * 2. Then uncomment the line below
     *
     * This can help diagnose issues with route protection in localhost
     * The feature toggle should be managed via Flipper Admin UI (http://localhost:3000/flipper/features/ezr_route_guard_enabled)
     *
     * // console.log('DEBUG routes.jsx: Bypassing protection in localhost. Feature toggle:', featureToggleStatus);
     */
    return route; // Return the original route without any auth wrapping
  }

  const protectedRoute = createProtectedRoute(route, state);

  // If the route should be protected, wrap it with our auth component
  if (protectedRoute !== route && protectedRoute.component) {
    return {
      ...protectedRoute,
      component: wrapWithAuth(protectedRoute.component),
    };
  }

  return protectedRoute;
};

// Create the base routes and protect them
const formRoutes = createRoutesWithSaveInProgress(formConfig);

// Create protected routes
// Map each form route to a protected route
// This will respect the feature toggle setting from Flipper Admin UI
const protectedRoutes = formRoutes.map(route =>
  protectedRouteWithAuth(route, null),
);

/**
 * The main route configuration for the application.
 *
 * This route is the root of the entire application, and all other routes
 * are children of this route. The component prop is set to App, which is
 * the main entry-point component for the application.
 *
 * The indexRoute is set to redirect to /introduction, which is the first
 * page of the application.
 *
 * The childRoutes property is set to the protectedRoutes array, which
 * contains all of the routes that have been protected with authentication
 * checks.
 */
const route = {
  path: '/',
  component: App, // Use component directly
  indexRoute: {
    onEnter: (nextState, replace) => replace('/introduction'),
  },
  childRoutes: protectedRoutes,
};

export default route;
