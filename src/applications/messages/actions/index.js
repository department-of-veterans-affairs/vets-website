import { apiRequest } from 'platform/utilities/api';
import moment from 'moment';

export const FETCH_INQUIRIES = 'FETCH_INQUIRIES';

const processInquiries = inquiries => {
  return inquiries.map(inquiry => {
    return {
      ...inquiry,
      dateLastUpdated: moment(inquiry.lastActiveTimestamp).format('MM/DD/YYYY'),
    };
  });
};

export function fetchInquiries() {
  return dispatch => {
    return apiRequest('/messages/inquiries', null)
      .then(response => {
        dispatch({
          type: FETCH_INQUIRIES,
          data: processInquiries(response.inquiries),
        });
      })
      .catch(error => {
        throw error;
      });
  };
}
