import Raven from 'raven-js';

import { apiRequest } from '../../common/helpers/api';

import {
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  GET_ENROLLMENT_DATA_FAILURE,
  GET_ENROLLMENT_DATA_SUCCESS,
  NO_CHAPTER33_RECORD_AVAILABLE,
  metaStatus
} from '../utils/constants';

export function getEnrollmentData() {
  return (dispatch) => {
    apiRequest(
      '/post911_gi_bill_status',
      null,
      (response) => {
        // TODO: remove this once vets-api stops returning 200s that pass
        // errors in the `meta` object. Instead, it will transform these into
        // non-200 status codes so the error callback will handle them.
        if (response.meta) {
          if (response.meta.status === metaStatus.SERVER_ERROR ||
              response.meta.status === metaStatus.NOT_FOUND) {
            return dispatch({ type: BACKEND_SERVICE_ERROR });
          }
          if (response.meta.status === metaStatus.NOT_AUTHORIZED) {
            return dispatch({ type: BACKEND_AUTHENTICATION_ERROR });
          }
        }
        return dispatch({
          type: GET_ENROLLMENT_DATA_SUCCESS,
          data: response.data.attributes,
        });
      },
      (response) => {
        if (response.status === 503 || response.status === 504) {
          // Either EVSS or a partner service is down or EVSS times out
          return dispatch({ type: BACKEND_SERVICE_ERROR });
        }
        if (response.status === 403) {
          // Backend authentication problem
          return dispatch({ type: BACKEND_AUTHENTICATION_ERROR });
        }
        if (response.status === 404) {
          // EVSS partner service has no record of this user
          return dispatch({ type: NO_CHAPTER33_RECORD_AVAILABLE });
        }
        return Promise.reject(
          new Error('post-911-gib-status getEnrollmentData() received unexpected status code: `${response.status}`'));
      })
      .catch((error) => {
        Raven.captureException(error);
        return dispatch({ type: GET_ENROLLMENT_DATA_FAILURE });
      });
  };
}
