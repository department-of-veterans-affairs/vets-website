/**
 * @module routes/routes
 * @description Route configuration for VA Form 21-2680 application
 *
 * Configures React Router with save-in-progress functionality,
 * enabling automatic routing for all form pages, save/load capabilities,
 * and proper navigation flow through the form chapters.
 */

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';
import App from '@bio-aquia/21-2680-house-bound-status/containers/app';

/**
 * Route configuration object for VA Form 21-2680
 *
 * @typedef {Object} RouteConfig
 * @property {string} path - Base path for the application ('/')
 * @property {React.Component} component - Root App component
 * @property {Object} indexRoute - Default route redirects to introduction
 * @property {Array<Object>} childRoutes - Generated routes for all form pages
 *
 * The childRoutes are automatically generated from formConfig and include:
 * - Introduction page
 * - All form chapter pages (veteran info, claimant info, claim details, hospitalization)
 * - Review page
 * - Confirmation page
 * - Save-in-progress routes (/resume, /form-saved, /error)
 */

/**
 * Main route configuration for the 21-2680 form application
 *
 * Creates a route tree with save-in-progress functionality that:
 * - Redirects root path to /introduction
 * - Generates routes for all form pages from formConfig
 * - Enables save/resume functionality
 * - Handles form validation and navigation
 *
 * @type {RouteConfig}
 */
const route = {
  path: '/',
  component: App,
  indexRoute: { onEnter: (_nextState, replace) => replace('/introduction') },
  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
