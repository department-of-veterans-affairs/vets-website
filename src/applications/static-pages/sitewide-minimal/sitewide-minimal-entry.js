import 'platform/polyfills';

import * as Sentry from '@sentry/browser';
import createCommonStore from 'platform/startup/store';
import startSitewideComponents from 'platform/site-wide';
import { GLOBAL_STORE_VARIABLE_NAME } from './constants';

// Set the app name header when using the apiRequest helper
window.appName = 'sitewide-minimal';

// Set errors to have the appropriate source tag.
Sentry.configureScope(scope => scope.setTag('source', 'sitewide-minimal'));

// Create the Redux store with minimal reducers (no app-specific reducers)
const store = createCommonStore();

// Expose the store to the global scope for use in other sitewide bundles
window[GLOBAL_STORE_VARIABLE_NAME] = store;

// Initialize sitewide components (header and footer)
startSitewideComponents(store);
