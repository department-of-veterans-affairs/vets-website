import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

import { GET_ENROLLMENT_DATA_SUCCESS } from '../utils/constants';

export function getEnrollmentData() {
  return dispatch =>
    apiRequest('/post911_gi_bill_status', null, response => {
      recordEvent({ event: 'post911-status-success' });
      return dispatch({
        type: GET_ENROLLMENT_DATA_SUCCESS,
        data: response.data.attributes,
      });
    });
}
