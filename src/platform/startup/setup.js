import * as Sentry from '@sentry/browser';

import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import { getScheduledDowntime } from 'platform/monitoring/DowntimeNotification/actions';
import createCommonStore from './store';
import startSitewideComponents from '../site-wide';

/**
 * Wrapper for creating a store and sitewide components, used across all apps
 *
 * @param {object} appInfo The UI and business logic of your React application
 * @param {string} appInfo.entryName The name of the app being built
 * @param {object} appInfo.reducer An object containing reducer functions. Will have
 * combineReducers run on it after being merged with the common, cross-site reducer.
 * @param {string} appInfo.url The base url for the React application
 * @param {array} appInfo.analyticsEvents An array which contains analytics events to collect
 * when the respective actions are fired.
 * @param {boolean} preloadScheduledDowntimes Whether to fetch scheduled downtimes.
 */
export default function setUpCommonFunctionality({
  entryName,
  reducer,
  analyticsEvents,
  url,
  preloadScheduledDowntimes,
}) {
  // Set further errors to have the appropriate source tag
  Sentry.setTag('source', entryName);

  // Set the app name for use in the apiRequest helper
  window.appName = entryName;

  const store = createCommonStore(reducer, analyticsEvents);
  connectFeatureToggle(store.dispatch);

  if (preloadScheduledDowntimes) {
    const actionCreator = getScheduledDowntime();
    actionCreator(store.dispatch, store.getState());
  }

  if (url?.endsWith('/')) {
    throw new Error(
      'Root urls should not end with a slash. Check your manifest.json file and application entry file.',
    );
  }

  Sentry.withScope(scope => {
    scope.setTag('source', 'site-wide');
    startSitewideComponents(store);
  });

  return store;
}
