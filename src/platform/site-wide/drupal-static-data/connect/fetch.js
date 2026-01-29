import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';
import { DATA_FILES_PATH } from '../constants';

/**
 * Fetches a Drupal static data file from the appropriate server.
 *
 * @param {string} fileName - The name of the file to fetch.
 * @param {string} [server] - Optional custom server URL to override the default base URL.
 * @param {boolean} [useLocalOverride=true] - Switch to enable or disable local environment check.
 * @returns {Promise<Object|undefined>} - The parsed JSON response or undefined if an error occurs.
 */
export const fetchDrupalStaticDataFile = async ({
  fileName,
  server,
  useLocalOverride = true,
}) => {
  // Use API_URL for localhost, BASE_URL otherwise
  const isLocal = useLocalOverride
    ? environment.isLocalhost?.() || window.location.hostname === 'localhost'
    : false;

  // Set the base URL based on the environment or custom server
  const baseUrl =
    server || (isLocal ? environment.API_URL : environment.BASE_URL);

  try {
    const result = await fetch(`${baseUrl}/${DATA_FILES_PATH}/${fileName}`);
    return await result.json();
  } catch (err) {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      Sentry.captureMessage(
        `drupal_static_file_fetch_error: ${fileName} ${err}`,
      );
    });
    return undefined;
  }
};
