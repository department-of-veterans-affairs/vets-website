import { apiRequest } from 'platform/utilities/api';

export const FETCH_INQUIRIES = 'FETCH_INQUIRIES';

export function fetchInquiries() {
  return dispatch => {
    return apiRequest('/messages/inquiries', null)
      .then(response => {
        dispatch({
          type: FETCH_INQUIRIES,
          data: response.inquiries,
        });
      })
      .catch(error => {
        throw error;
      });
  };
}
