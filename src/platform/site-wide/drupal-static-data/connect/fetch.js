import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';
import { DATA_FILES_PATH } from '../constants';

export const fetchDrupalStaticDataFile = async (fileName, server) => {
  // Use API_URL for localhost, BASE_URL otherwise
  const isLocal =
    environment.isLocalhost?.() || window.location.hostname === 'localhost';

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
