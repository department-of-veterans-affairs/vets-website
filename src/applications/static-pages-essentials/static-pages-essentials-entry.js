/**
 * static-pages-essentials.entry.js (alternative to static-pages.entry.js)
 *
 * This bundle contains sitewide components and Redux store setup that are
 * required on every page of the static site. It's part of a two-bundle
 * strategy to replace the monolithic static-pages.entry.js bundle.
 *
 * Strategy: This "essentials" bundle is loaded and cached on every page, while
 * page-specific widgets are loaded in separate bundles only when needed. This
 * reduces initial bundle size and improves cache efficiency since changes to
 * individual widgets don't invalidate the entire bundle cache.
 *
 * Contents:
 * - Redux store (exposed globally for use by widget bundles)
 * - Sitewide components: Header, Footer, Side Nav, Maintenance Banner,
 *   Situation Updates Banner
 */

import * as Sentry from '@sentry/browser';
import createCommonStore from 'platform/startup/store';
import startSitewideComponents from 'platform/site-wide';
import { setGlobalStore } from './store';

// Set the app name header when using the apiRequest helper
window.appName = 'static-pages-essentials';

// Set errors to have the appropriate source tag.
Sentry.configureScope(scope =>
  scope.setTag('source', 'static-pages-essentials'),
);

// Create the Redux store with minimal reducers (no app-specific reducers)
const store = createCommonStore();

// Expose the store to the global scope for use in other sitewide bundles
setGlobalStore(store);

// Initialize sitewide components (header and footer)
startSitewideComponents(store);
