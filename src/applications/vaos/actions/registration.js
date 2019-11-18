import * as Sentry from '@sentry/browser';

import { getSystemIdentifiers } from '../api';

export const REGISTRATION_CHECK = 'vaos/REGISTRATION_CHECK';
export const REGISTRATION_CHECK_SUCCEEDED = 'vaos/REGISTRATION_CHECK_SUCCEEDED';
export const REGISTRATION_CHECK_FAILED = 'vaos/REGISTRATION_CHECK_FAILED';

export function checkRegistration() {
  return async dispatch => {
    dispatch({
      type: REGISTRATION_CHECK,
    });

    try {
      const systemIds = await getSystemIdentifiers();

      dispatch({
        type: REGISTRATION_CHECK_SUCCEEDED,
        systemIds,
      });
    } catch (e) {
      Sentry.captureException(e);
      dispatch({
        type: REGISTRATION_CHECK_FAILED,
      });
    }
  };
}
