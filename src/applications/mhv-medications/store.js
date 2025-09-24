/**
 * Module for exporting the Redux store for the medications application
 */

import setUpCommonFunctionality from 'platform/startup/setup';
import { allergiesApi } from './api/allergiesApi';
import { prescriptionsApi } from './api/prescriptionsApi';
import manifest from './manifest.json';
import reducer from './reducers';

/**
 * Creates and exports a configured Redux store for the medications application
 * that can be imported and used throughout the application
 */
export default function createStore(
  additionalMiddlewares = [
    allergiesApi.middleware,
    prescriptionsApi.middleware,
  ],
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
