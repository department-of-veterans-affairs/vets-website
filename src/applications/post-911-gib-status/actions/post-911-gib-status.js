import * as Sentry from '@sentry/browser';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from 'platform/utilities/environment';

import {
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  GET_ENROLLMENT_DATA_FAILURE,
  GET_ENROLLMENT_DATA_SUCCESS,
  NO_CHAPTER33_RECORD_AVAILABLE,
  SERVICE_DOWNTIME_ERROR,
} from '../utils/constants';

export function getEnrollmentData(apiVersion, enableSobClaimantService) {
  return dispatch => {
    const sobUrl = `${environment.API_URL}/sob/v0/ch33_status`;
    const updatedUrl = enableSobClaimantService
      ? sobUrl
      : '/post911_gi_bill_status';
    return apiRequest(
      updatedUrl,
      apiVersion,
      response => {
        recordEvent({ event: 'post911-status-success' });
        return dispatch({
          type: GET_ENROLLMENT_DATA_SUCCESS,
          data: response.data.attributes,
        });
      },
      response => {
        recordEvent({ event: 'post911-status-failure' });
        const error =
          response.errors.length > 0 ? response.errors[0] : undefined;
        if (error) {
          if (error.status === '503') {
            // Lighthouse (LTS) Service Downtime Error
            return dispatch({
              type: SERVICE_DOWNTIME_ERROR,
            });
          }
          if (error.status === '504') {
            // Either Lighthouse (LTS) or a partner service is down or Lighthouse times out
            return dispatch({
              type: BACKEND_SERVICE_ERROR,
            });
          }
          if (error.status === '403') {
            // Backend authentication problem
            return dispatch({ type: BACKEND_AUTHENTICATION_ERROR });
          }
          if (error.status === '404') {
            // Lighthouse (LTS) partner service has no record of this user
            return dispatch({
              type: NO_CHAPTER33_RECORD_AVAILABLE,
            });
          }
          return Promise.reject(
            new Error(
              `post-911-gib-status getEnrollmentData() received unexpected error: ${
                error.status
              }: ${error.title}: ${error.detail}`,
            ),
          );
        }
        return Promise.reject(
          new Error(
            'post-911-gib-status getEnrollmentData() received unexpected error (no status code available)',
          ),
        );
      },
    ).catch(error => {
      Sentry.captureException(error);
      return dispatch({ type: GET_ENROLLMENT_DATA_FAILURE });
    });
  };
}
