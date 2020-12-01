import { apiRequest } from 'platform/utilities/api';
import moment from 'moment';

export const FETCH_INQUIRIES_SUCCESS = 'FETCH_INQUIRIES_SUCCESS';

const processInquiries = inquiries => {
  return inquiries.map(inquiry => {
    return {
      ...inquiry,
      dateLastUpdated: moment(inquiry.lastActiveTimestamp).format(
        'MMMM D, YYYY',
      ),
    };
  });
};

export function fetchInquiries() {
  return dispatch => {
    return apiRequest('/messages/inquiries', null)
      .then(response => {
        dispatch({
          type: FETCH_INQUIRIES_SUCCESS,
          data: processInquiries(response.inquiries),
        });
      })
      .catch(error => {
        throw error;
      });
  };
}
