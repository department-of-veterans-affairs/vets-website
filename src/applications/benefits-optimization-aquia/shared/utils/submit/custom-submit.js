import {
  getInfoToken,
  infoTokenExists,
  refresh,
} from 'platform/utilities/oauth/utilities';
import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { logger } from '@bio-aquia/shared/utils/logger';

// If the token expires within this many seconds, refresh it before submitting.
// Two minutes gives enough headroom to prevent a 403 from ever being logged
// while keeping unnecessary refreshes to a minimum.
const TOKEN_EXPIRATION_BUFFER = 120;
const log = logger.withContext('customSubmit');

/**
 * Normalizes a token expiration value to Unix epoch seconds.
 *
 * OAuth info tokens can represent expiration in different formats depending
 * on the auth provider (SiS, ID.me, Login.gov). This helper handles:
 * - Date objects (e.g., `new Date('2026-02-24T12:00:00Z')`)
 * - Numbers in seconds (epoch < 1e12, e.g., `1740000000`)
 * - Numbers in milliseconds (epoch >= 1e12, e.g., `1740000000000`)
 * - ISO date strings (e.g., `'2026-02-24T12:00:00Z'`)
 *
 * @param {Date|number|string|null|undefined} expirationValue - The token expiration
 * @returns {number|null} Expiration as Unix epoch seconds, or null if unparseable
 */
const toEpochSeconds = expirationValue => {
  if (!expirationValue) return null;

  if (expirationValue instanceof Date) {
    return Math.floor(expirationValue.getTime() / 1000);
  }

  if (typeof expirationValue === 'number') {
    // Distinguish milliseconds from seconds: any value above 1e12 (~2001 in ms)
    // is certainly milliseconds since no seconds-based epoch reaches that range
    // until the year ~33658.
    return expirationValue > 1e12
      ? Math.floor(expirationValue / 1000)
      : Math.floor(expirationValue);
  }

  if (typeof expirationValue === 'string') {
    const parsed = Date.parse(expirationValue);
    if (!Number.isNaN(parsed)) {
      return Math.floor(parsed / 1000);
    }
  }

  return null;
};

/**
 * Custom submit function with proactive token refresh
 *
 * This function wraps the standard form submission process with proactive token refresh
 * to minimize 403 errors from expired authentication tokens.
 *
 * Flow:
 * 1. Check if user is authenticated
 * 2. Check token expiration time
 * 3. Only refresh if token expires within set expiration buffer
 * 4. Transform form data using configured transformer
 * 5. Submit to API endpoint
 * 6. Platform's reactive 403 retry still works as fallback
 *
 * Benefits:
 * - Reduces 403 errors from expired tokens
 * - Cleaner logs and metrics (fewer false positives)
 * - Better user experience (no visible retry delay)
 * - Minimal latency overhead (skips refresh for fresh tokens)
 * - Platform's 403 retry remains as a safety net
 *
 * @param {Object} form - Form data object containing submission information
 * @param {Object} form.data - The actual form field data
 * @param {Object} form.loadedData - Pre-filled or saved form data
 * @param {Object} formConfig - Form configuration object
 * @param {Function} formConfig.transformForSubmit - Function to transform data for API
 * @param {string} formConfig.submitUrl - API endpoint URL for submission
 * @param {string} formConfig.trackingPrefix - Prefix for analytics tracking
 * @returns {Promise} Promise that resolves with API response or rejects with error
 */
export const customSubmit = async (form, formConfig) => {
  const infoToken = infoTokenExists() ? getInfoToken() : null;

  // Normalize expiration to epoch seconds regardless of provider format.
  // Without this, a millisecond or ISO string value would cause the
  // subtraction below to silently produce a wrong/NaN result, making the
  // proactive refresh never trigger in production.
  const expirationTime = toEpochSeconds(infoToken?.access_token_expiration);

  const serviceName = sessionStorage.getItem('serviceName');

  // Debug logging at every decision point so we can diagnose refresh
  // behavior locally, these are suppressed in production (debug level
  // is not sent to GTM). The original implementation had no visibility
  // into why a refresh was skipped, making failures invisible.
  log.debug('custom submit invoked', {
    hasInfoToken: Boolean(infoToken),
    hasExpirationTime: Boolean(expirationTime),
    hasServiceName: Boolean(serviceName),
  });

  if (expirationTime) {
    const timeUntilExpiration = expirationTime - Math.floor(Date.now() / 1000);
    log.debug('token expiration check', {
      timeUntilExpiration,
      expirationBuffer: TOKEN_EXPIRATION_BUFFER,
    });

    if (timeUntilExpiration < TOKEN_EXPIRATION_BUFFER) {
      try {
        log.info('Refreshing token');
        await refresh({ type: serviceName });
        log.info('Token refreshed successfully');
      } catch (error) {
        // Don't block submission, if the proactive refresh fails, the platform's
        // 403 retry handles it.
        log.warn(
          'Proactive token refresh failed, proceeding with submission',
          error,
        );
      }
    } else {
      log.debug('Skipping proactive refresh: token still fresh');
    }
  } else {
    log.debug('Skipping proactive refresh: missing token expiration');
  }

  // Use the form-specific transformer if configured, otherwise fall back to
  // the platform's generic transformer for consistency.
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  return submitToUrl(body, formConfig.submitUrl, formConfig.trackingPrefix);
};

export default customSubmit;
