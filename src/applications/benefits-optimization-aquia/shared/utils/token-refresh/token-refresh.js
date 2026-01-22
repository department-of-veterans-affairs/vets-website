import * as Sentry from '@sentry/browser';
import { refresh, infoTokenExists } from 'platform/utilities/oauth/utilities';

/**
 * Form configuration callback to refresh OAuth tokens when loading saved forms.
 * Prevents 403 errors when users resume forms after token expiration.
 *
 * This function should be used as the `onFormLoaded` callback in form configurations.
 * When provided, the callback is responsible for navigating to the returnUrl.
 *
 * @param {string} formId - Form identifier for logging (e.g., '21-4192')
 * @returns {Function} Async callback function for onFormLoaded
 *
 * @example
 * // In form config:
 * import { createOnFormLoadedWithTokenRefresh } from '@bio-aquia/shared/utils';
 *
 * const formConfig = {
 *   formId: '21-4192',
 *   onFormLoaded: createOnFormLoadedWithTokenRefresh('21-4192'),
 *   // ... other config
 * };
 */
export const createOnFormLoadedWithTokenRefresh = formId => async props => {
  if (infoTokenExists()) {
    const serviceName = sessionStorage.getItem('serviceName');
    if (serviceName) {
      try {
        await refresh({ type: serviceName });
      } catch (error) {
        Sentry.withScope(scope => {
          scope.setExtra('error', error);
          scope.setExtra('serviceName', serviceName);
          scope.setExtra('formId', formId);
          scope.setFingerprint(['{{default}}', `token-refresh-form-${formId}`]);
          Sentry.captureMessage(
            `Token refresh failed when loading saved form ${formId}: ${
              error.message
            }`,
          );
        });
      }
    }
  }

  // Navigate to the saved returnUrl (required when onFormLoaded is provided)
  props.router.push(props.returnUrl);
};
