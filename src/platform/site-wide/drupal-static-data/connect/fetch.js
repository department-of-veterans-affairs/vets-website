import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';
import { DATA_FILES_PATH } from '../constants';

export const fetchDrupalStaticDataFile = async (
  fileName,
  server = environment.BASE_URL,
) => {
  try {
    const result = await fetch(`${server}/${DATA_FILES_PATH}/${fileName}`);
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
