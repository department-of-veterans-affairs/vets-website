import {
  getInfoToken,
  infoTokenExists,
  refresh,
} from 'platform/utilities/oauth/utilities';
import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { logger } from '@bio-aquia/shared/utils/logger';

const TOKEN_EXPIRATION_BUFFER = 120; // expiration buffer set to two minutes.
const log = logger.withContext('customSubmit');

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
 * - Maintains fallback retry logic for resilience
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
  const expirationTime = infoToken?.access_token_expiration;
  const serviceName = sessionStorage.getItem('serviceName');

  if (expirationTime && serviceName) {
    const timeUntilExpiration = expirationTime - Math.floor(Date.now() / 1000);

    if (timeUntilExpiration < TOKEN_EXPIRATION_BUFFER) {
      try {
        log.info('Refreshing token');
        await refresh({ type: serviceName });
        log.info('Token refreshed successfully');
      } catch (error) {
        log.warn(
          'Proactive token refresh failed, proceeding with submission',
          error,
        );
      }
    }
  }

  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  return submitToUrl(body, formConfig.submitUrl, formConfig.trackingPrefix);
};

export default customSubmit;
