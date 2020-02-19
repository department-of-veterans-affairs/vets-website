import { captureError } from '../utils/error';

import { getUserIdentifiers } from '../api';

export const REGISTRATION_CHECK = 'vaos/REGISTRATION_CHECK';
export const REGISTRATION_CHECK_SUCCEEDED = 'vaos/REGISTRATION_CHECK_SUCCEEDED';
export const REGISTRATION_CHECK_FAILED = 'vaos/REGISTRATION_CHECK_FAILED';

export function checkRegistration() {
  return async dispatch => {
    dispatch({
      type: REGISTRATION_CHECK,
    });

    try {
      const userIds = await getUserIdentifiers();

      dispatch({
        type: REGISTRATION_CHECK_SUCCEEDED,
        userIds,
      });
    } catch (e) {
      captureError(e);
      dispatch({
        type: REGISTRATION_CHECK_FAILED,
      });
    }
  };
}
