import React from 'react';
import { createRoutesWithSaveInProgress } from '@department-of-veterans-affairs/platform-forms/save-in-progress/helpers';
import { connect } from 'react-redux';
import formConfig from './config/form';
import App from './containers/App';
import AuthenticatedRoute from './containers/AuthenticatedRoute';
import { createProtectedRoute } from './utils/helpers/route-guard';

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
const protectedRoutes = formRoutes.map(route => protectedRouteWithAuth(route));

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
