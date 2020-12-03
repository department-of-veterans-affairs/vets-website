import _ from 'lodash';
import moment from 'moment';

import { apiRequest } from 'platform/utilities/api';

export const FETCH_INQUIRIES_SUCCESS = 'FETCH_INQUIRIES_SUCCESS';

export const processInquiries = inquiries => {
  return inquiries.map(inquiry => {
    return {
      ...inquiry,
      dateLastUpdated: moment(inquiry.lastActiveTimestamp).format(
        'MMMM D, YYYY',
      ),
      status: _.capitalize(inquiry.status),
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
