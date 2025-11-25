/**
 * Module for exporting the Redux store for the medications refills application
 */

import setUpCommonFunctionality from 'platform/startup/setup';
import { refillsApi } from './api/refillsApi';
import manifest from './manifest.json';
import reducer from './reducers';

/**
 * Creates and exports a configured Redux store for the medications refills application
 * Includes RTK Query middleware for automatic caching and refetching
 *
 * @param {Array} additionalMiddlewares - Additional Redux middleware to include
 * @returns {Object} Configured Redux store
 */
export default function createStore(
  additionalMiddlewares = [refillsApi.middleware],
) {
  return setUpCommonFunctionality({
    entryName: manifest.entryName,
    url: manifest.rootUrl,
    reducer,
    preloadScheduledDowntimes: true,
    additionalMiddlewares,
  });
}

// Create the store instance that can be imported throughout the app
export const store = createStore();
