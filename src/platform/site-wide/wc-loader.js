import 'core-js/features/promise';
import '@department-of-veterans-affairs/component-library/dist/main.css';
import {
  applyPolyfills,
  defineCustomElements,
} from '@department-of-veterans-affairs/component-library';
import { isChunkLoadError } from '@department-of-veterans-affairs/platform-utilities/lazy-load-with-retry';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

/**
 * Initialize web components with retry logic for transient network failures.
 *
 * DataDog RUM analysis (100k+ errors/week) shows chunk load requests
 * complete with no HTTP status code, indicating network interruption.
 * Retrying with exponential backoff recovers from these transient failures.
 *
 * @param {number} [attempt=1] - Current attempt number (1-indexed)
 * @returns {Promise<void>}
 */
async function initWithRetry(attempt = 1) {
  try {
    await applyPolyfills();
    await defineCustomElements();
  } catch (error) {
    if (attempt <= MAX_RETRIES && isChunkLoadError(error)) {
      const delay = BASE_DELAY_MS * attempt;
      // eslint-disable-next-line no-console
      console.warn(
        `[wc-loader] Retry ${attempt}/${MAX_RETRIES} after ChunkLoadError`,
      );
      await new Promise(resolve => setTimeout(resolve, delay));
      await initWithRetry(attempt + 1);
      return;
    }
    throw error;
  }
}

// Don't initialize web components on saved pages because this causes the
// content to become hidden. It does end up breaking the styling, but this is
// better than not being able to see the internal content
if (window.location?.protocol !== 'file:') {
  initWithRetry();
}
