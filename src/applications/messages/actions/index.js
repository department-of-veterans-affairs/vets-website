import _ from 'lodash';
import moment from 'moment';

import { apiRequest } from 'platform/utilities/api';

export const FETCH_INQUIRIES_SUCCESS = 'FETCH_INQUIRIES_SUCCESS';

export const transformInquiries = inquiries => {
  return _.orderBy(inquiries, 'lastActiveTimestamp', 'desc').map(inquiry => {
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
    const response = await apiRequest('/contact_us/inquiries', null);
    dispatch({
      type: FETCH_INQUIRIES_SUCCESS,
      data: transformInquiries(response.inquiries),
    });
  };
}
