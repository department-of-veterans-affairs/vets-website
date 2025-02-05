import * as Sentry from '@sentry/browser';

import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import startSitewideComponents from 'platform/site-wide';
import createCommonStore from 'platform/startup/store';

/**
 * Wrapper for creating a store and sitewide components, this async version is used
 * so that the feature toggles can fully load before the store is returned
 *
 * @param {object} appInfo The UI and business logic of your React application
 * @param {string} appInfo.entryName The name of the app being built
 * @param {object} appInfo.reducer An object containing reducer functions. Will have
 * combineReducers run on it after being merged with the common, cross-site reducer.
 * @param {string} appInfo.url The base url for the React application
 * @param {array} appInfo.analyticsEvents An array which contains analytics events to collect
 * when the respective actions are fired.
 */
export default async function asyncSetUpCommonFunctionality({
  entryName,
  reducer,
  analyticsEvents,
  url,
}) {
  // Set further errors to have the appropriate source tag
  Sentry.setTag('source', entryName);

  // Set the app name for use in the apiRequest helper
  window.appName = entryName;

  const store = createCommonStore(reducer, analyticsEvents);
  await connectFeatureToggle(store.dispatch);

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
