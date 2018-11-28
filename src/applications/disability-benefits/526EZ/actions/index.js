import Raven from 'raven-js';

import { apiRequest } from '../../../../platform/utilities/api';

export const ITF_FETCH_INITIATED = 'ITF_FETCH_INITIATED';
export const ITF_FETCH_SUCCEEDED = 'ITF_FETCH_SUCCEEDED';
export const ITF_FETCH_FAILED = 'ITF_FETCH_FAILED';

export const ITF_CREATION_INITIATED = 'ITF_CREATION_INITIATED';
export const ITF_CREATION_SUCCEEDED = 'ITF_CREATION_SUCCEEDED';
export const ITF_CREATION_FAILED = 'ITF_CREATION_FAILED';

export function fetchITF() {
  return dispatch => {
    dispatch({ type: ITF_FETCH_INITIATED });

    return apiRequest(
      '/intent_to_file',
      null,
      ({ data }) => dispatch({ type: ITF_FETCH_SUCCEEDED, data }),
      () => {
        Raven.captureMessage('itf_fetch_failed');
        dispatch({ type: ITF_FETCH_FAILED });
      },
    );
  };
}

export function createITF() {
  return dispatch => {
    dispatch({ type: ITF_CREATION_INITIATED });

    return apiRequest(
      '/intent_to_file/compensation',
      { method: 'POST' },
      ({ data }) => dispatch({ type: ITF_CREATION_SUCCEEDED, data }),
      () => {
        Raven.captureMessage('itf_creation_failed');
        dispatch({ type: ITF_CREATION_FAILED });
      },
    );
  };
}
