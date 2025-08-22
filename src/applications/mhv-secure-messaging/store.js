/**
 * Redux store setup for the Secure Messaging application
 */

import setUpCommonFunctionality from 'platform/startup/setup';
import manifest from './manifest.json';
import reducer from './reducers';

export default function createStore(additionalMiddlewares = []) {
  return setUpCommonFunctionality({
    entryName: manifest.entryName,
    url: manifest.rootUrl,
    reducer,
    preloadScheduledDowntimes: true,
    additionalMiddlewares,
  });
}

export const store = createStore();

