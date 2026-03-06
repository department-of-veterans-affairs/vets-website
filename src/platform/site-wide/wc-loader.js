import 'core-js/features/promise';
import '@department-of-veterans-affairs/component-library/dist/main.css';
import {
  applyPolyfills,
  defineCustomElements,
} from '@department-of-veterans-affairs/component-library';
import { loadWithRetry } from '@department-of-veterans-affairs/platform-utilities/lazy-load-with-retry';

/**
 * Initialize web components with retry logic for transient network failures.
 *
 * DataDog RUM analysis (100k+ errors/week) shows chunk load requests
 * complete with no HTTP status code, indicating network interruption.
 * Retrying with exponential backoff recovers from these transient failures.
 */
async function initWebComponents() {
  await applyPolyfills();
  await defineCustomElements();
}

// Don't initialize web components on saved pages because this causes the
// content to become hidden. It does end up breaking the styling, but this is
// better than not being able to see the internal content
if (window.location?.protocol !== 'file:') {
  loadWithRetry(initWebComponents, 3, 1000, 10000).catch(error =>
    window.DD_RUM?.addError(error, { source: 'wc-loader' }),
  );
}
