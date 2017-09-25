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
            window.dataLayer.push({ event: 'post911-status-failure' });
            return dispatch({ type: BACKEND_SERVICE_ERROR });
          }
          if (response.meta.status === metaStatus.NOT_AUTHORIZED) {
            window.dataLayer.push({ event: 'post911-status-failure' });
            return dispatch({ type: BACKEND_AUTHENTICATION_ERROR });
          }
        }
        window.dataLayer.push({ event: 'post911-status-success' });
        return dispatch({
          type: GET_ENROLLMENT_DATA_SUCCESS,
          data: response.data.attributes,
        });
      },
      (response) => {
        window.dataLayer.push({ event: 'post911-status-failure' });
        const error = response.errors.length > 0 ? response.errors[0] : undefined;
        if (error) {
          if (error.status === '503' || error.status === '504') {
            // Either EVSS or a partner service is down or EVSS times out
            return dispatch({ type: BACKEND_SERVICE_ERROR });
          }
          if (error.status === '403') {
            // Backend authentication problem
            return dispatch({ type: BACKEND_AUTHENTICATION_ERROR });
          }
          if (error.status === '404') {
            // EVSS partner service has no record of this user
            return dispatch({ type: NO_CHAPTER33_RECORD_AVAILABLE });
          }
          return Promise.reject(
            new Error(`post-911-gib-status getEnrollmentData() received unexpected error: ${error.status}: ${error.title}: ${error.detail}`));
        }
        return Promise.reject(
          new Error('post-911-gib-status getEnrollmentData() received unexpected error (no status code available)'));
      })
      .catch((error) => {
        Raven.captureException(error);
        return dispatch({ type: GET_ENROLLMENT_DATA_FAILURE });
      });
  };
}
