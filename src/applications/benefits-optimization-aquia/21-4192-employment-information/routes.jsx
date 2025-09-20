/**
 * @module routes
 * @description React Router configuration for VA Form 21-4192
 */

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { formConfig } from '@bio-aquia/21-4192-employment-information/config';
import { App } from '@bio-aquia/21-4192-employment-information/containers';

/**
 * Route configuration object for the application
 * Sets up the main app component and child routes with save-in-progress functionality
 *
 * @typedef {Object} RouteConfig
 * @property {string} path - Base path for the application
 * @property {React.Component} component - Root component (App)
 * @property {Object} indexRoute - Default redirect configuration
 * @property {Function} indexRoute.onEnter - Redirects to introduction page
 * @property {Array} childRoutes - Form pages generated from form config
 */

/**
 * Main route configuration
 * @type {RouteConfig}
 */
const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
