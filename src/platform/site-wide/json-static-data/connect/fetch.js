import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';
import { DATA_FILES_PATH } from '../constants';

export const fetchJsonStaticDataFile = async fileName => {
  try {
    const result = await fetch(
      `${environment.BASE_URL}/${DATA_FILES_PATH}/${fileName}`,
    );
    return await result.json();
  } catch (err) {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      // Leaving this to say drupal, but it encompasses all static data file types, drupal, curl/axon, etc.
      Sentry.captureMessage(
        `drupal_static_file_fetch_error: ${fileName} ${err}`,
      );
    });
    return undefined;
  }
};
