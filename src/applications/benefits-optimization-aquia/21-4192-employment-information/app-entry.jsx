/**
 * @module app-entry
 * @description Application entry point for VA Form 21-4192
 * Initializes the React application with routing and Redux store
 */

import '@department-of-veterans-affairs/platform-polyfills';
import './sass/21-4192-employment-information.scss';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from '@bio-aquia/21-4192-employment-information/routes';
import reducer from '@bio-aquia/21-4192-employment-information/reducers';
import manifest from '@bio-aquia/21-4192-employment-information/manifest.json';

/**
 * Initialize and start the application
 * Sets up routing, Redux store, and mounts the app to the DOM
 *
 * @param {Object} config - Application configuration
 * @param {string} config.entryName - Application entry name from manifest
 * @param {string} config.url - Root URL for the application
 * @param {Object} config.reducer - Redux reducer configuration
 * @param {Object} config.routes - React Router route configuration
 */
startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});
