import _ from 'lodash';
import moment from 'moment';

import { apiRequest } from 'platform/utilities/api';

export const FETCH_INQUIRIES_SUCCESS = 'FETCH_INQUIRIES_SUCCESS';

export const transformInquiries = inquiries => {
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
  return async dispatch => {
    const response = await apiRequest('/messages/inquiries', null);
    dispatch({
      type: FETCH_INQUIRIES_SUCCESS,
      data: transformInquiries(response.inquiries),
    });
  };
}
