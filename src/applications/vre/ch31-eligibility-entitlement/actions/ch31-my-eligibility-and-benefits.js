import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from 'platform/utilities/environment';
import { getStatus, extractMessages } from '../helpers';
import {
  CH31_FETCH_STARTED,
  CH31_FETCH_SUCCEEDED,
  CH31_FETCH_FAILED,
  CH31_ERROR_400_BAD_REQUEST,
  CH31_ERROR_403_FORBIDDEN,
  CH31_ERROR_500_SERVER,
  CH31_ERROR_503_UNAVAILABLE,
  CH31_CASE_STATUS_DETAILS_FETCH_STARTED,
  CH31_CASE_STATUS_DETAILS_FETCH_SUCCEEDED,
  CH31_CASE_STATUS_DETAILS_FETCH_FAILED,
  CH31_CASE_STATUS_DETAILS_ERROR_400_BAD_REQUEST,
  CH31_CASE_STATUS_DETAILS_ERROR_403_FORBIDDEN,
  CH31_CASE_STATUS_DETAILS_ERROR_500_SERVER,
  CH31_CASE_STATUS_DETAILS_ERROR_503_UNAVAILABLE,
} from '../constants';

export function fetchCh31Eligibility() {
  return dispatch => {
    dispatch({ type: CH31_FETCH_STARTED });

    const url = `${environment.API_URL}/vre/v0/ch31_eligibility_status`;

    return apiRequest(url)
      .then(response => {
        dispatch({ type: CH31_FETCH_SUCCEEDED, payload: response });
      })
      .catch(errOrResp => {
        const status = getStatus(errOrResp);
        const messages = extractMessages(errOrResp);

        const typeByStatus = {
          400: CH31_ERROR_400_BAD_REQUEST,
          403: CH31_ERROR_403_FORBIDDEN,
          500: CH31_ERROR_500_SERVER,
          503: CH31_ERROR_503_UNAVAILABLE,
          504: CH31_ERROR_500_SERVER,
        };
        const type = typeByStatus[status] || CH31_FETCH_FAILED;

        dispatch({
          type,
          error: {
            status: status ?? null,
            messages: messages.length
              ? messages
              : [errOrResp?.message || 'Network error'],
          },
        });
      });
  };
}

export function fetchCh31CaseStatusDetails() {
  return dispatch => {
    dispatch({ type: CH31_CASE_STATUS_DETAILS_FETCH_STARTED });

    const url = `${environment.API_URL}/vre/v0/ch31_case_details`;

    return apiRequest(url)
      .then(response => {
        dispatch({
          type: CH31_CASE_STATUS_DETAILS_FETCH_SUCCEEDED,
          payload: response.data,
        });
      })
      .catch(errOrResp => {
        const status = getStatus(errOrResp);
        const messages = extractMessages(errOrResp);

        const typeByStatus = {
          400: CH31_CASE_STATUS_DETAILS_ERROR_400_BAD_REQUEST,
          403: CH31_CASE_STATUS_DETAILS_ERROR_403_FORBIDDEN,
          500: CH31_CASE_STATUS_DETAILS_ERROR_500_SERVER,
          503: CH31_CASE_STATUS_DETAILS_ERROR_503_UNAVAILABLE,
          504: CH31_CASE_STATUS_DETAILS_ERROR_500_SERVER,
        };

        const type =
          typeByStatus[status] || CH31_CASE_STATUS_DETAILS_FETCH_FAILED;

        dispatch({
          type,
          error: {
            status: status ?? null,
            messages: messages.length
              ? messages
              : [errOrResp?.message || 'Network error'],
          },
        });
      });
  };
}
