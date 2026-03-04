import * as Sentry from '@sentry/browser';

import { apiRequest } from 'platform/utilities/api';

export const ITF_FETCH_INITIATED = 'ITF_FETCH_INITIATED';
export const ITF_FETCH_SUCCEEDED = 'ITF_FETCH_SUCCEEDED';
export const ITF_FETCH_FAILED = 'ITF_FETCH_FAILED';

export const ITF_CREATION_INITIATED = 'ITF_CREATION_INITIATED';
export const ITF_CREATION_SUCCEEDED = 'ITF_CREATION_SUCCEEDED';
export const ITF_CREATION_FAILED = 'ITF_CREATION_FAILED';

export const ITF_MESSAGE_DISMISSED = 'ITF_MESSAGE_DISMISSED';

export function fetchITF() {
  return dispatch => {
    dispatch({ type: ITF_FETCH_INITIATED });

    return apiRequest('/intent_to_file')
      .then(({ data }) => dispatch({ type: ITF_FETCH_SUCCEEDED, data }))
      .catch(() => {
        Sentry.captureMessage('itf_fetch_failed');
        dispatch({ type: ITF_FETCH_FAILED });
      });
  };
}

export function createITF() {
  return dispatch => {
    dispatch({ type: ITF_CREATION_INITIATED });

    return apiRequest('/intent_to_file/compensation', { method: 'POST' })
      .then(({ data }) => dispatch({ type: ITF_CREATION_SUCCEEDED, data }))
      .catch(() => {
        Sentry.captureMessage('itf_creation_failed');
        dispatch({ type: ITF_CREATION_FAILED });
      });
  };
}

export function dismissITFMessage() {
  return { type: ITF_MESSAGE_DISMISSED };
}

// "add-person" service means the user has a edipi and SSN in the system, but
// is missing either a BIRLS or participant ID
export const MVI_ADD_NOT_ATTEMPTED = 'MVI_ADD_NOT_ATTEMPTED';
export const MVI_ADD_INITIATED = 'MVI_ADD_INITIATED';
export const MVI_ADD_SUCCEEDED = 'MVI_ADD_SUCCEEDED';
export const MVI_ADD_FAILED = 'MVI_ADD_FAILED';

export function addPerson() {
  return dispatch => {
    dispatch({ type: MVI_ADD_INITIATED });

    return apiRequest('/mvi_users/21-0966', { method: 'POST' })
      .then(({ data }) => dispatch({ type: MVI_ADD_SUCCEEDED, data }))
      .catch(() => {
        Sentry.captureMessage('mvi_add_failed');
        dispatch({ type: MVI_ADD_FAILED });
      });
  };
}
