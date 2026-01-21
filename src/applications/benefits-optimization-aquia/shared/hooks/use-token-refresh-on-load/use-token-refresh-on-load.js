import { useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import { refresh, infoTokenExists } from 'platform/utilities/oauth/utilities';

/**
 * Custom hook to refresh OAuth token when loading a saved form.
 *
 * Prevents 403 errors when users resume saved applications after token expiration.
 * Detects when user is on the '/loading' route (resuming saved form) and proactively
 * refreshes the access token before the form loads.
 *
 * This addresses the issue where:
 * 1. User saves form from review page after ~5min (token expires)
 * 2. Returns later and loads saved form via "Continue your application"
 * 3. Gets redirected to review page without triggering token refresh
 * 4. Submit fails with 403 error causing infinite loop
 *
 * Solution: Proactively refresh the access token on the /loading route before
 * the form loads, ensuring the token is valid before any API calls are made.
 * This works with the platform's automatic retry logic (retryOn in platform/utilities/api)
 * which handles subsequent 403 errors during normal form operations.
 *
 * @param {Object} location - React Router location object
 */
export const useTokenRefreshOnLoad = location => {
  useEffect(
    () => {
      const refreshTokenIfNeeded = async () => {
        if (infoTokenExists() && location?.pathname?.includes('loading')) {
          try {
            const serviceName = sessionStorage.getItem('serviceName');
            if (serviceName) {
              await refresh({ type: serviceName });
            }
          } catch (error) {
            // Token refresh failed - log to Sentry for monitoring
            // Platform retry logic (retryOn) will still handle subsequent 403s on API calls
            Sentry.withScope(scope => {
              scope.setExtra('error', error);
              scope.setExtra('location', location?.pathname);
              scope.setExtra(
                'serviceName',
                sessionStorage.getItem('serviceName'),
              );
              scope.setFingerprint(['{{default}}', 'token-refresh-on-load']);
              Sentry.captureMessage(
                `Token refresh failed on form load: ${error.message}`,
              );
            });

            // eslint-disable-next-line no-console
            console.error('Failed to refresh OAuth token on form load:', error);
          }
        }
      };
      refreshTokenIfNeeded();
    },
    [location],
  );
};
