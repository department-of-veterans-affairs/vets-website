import { apiRequest } from '../utils/helpers';

export function getEnrollmentData() {
  return (dispatch) => {
    apiRequest('/v0/post911_gi_bill_status',
      null,
      (response) => {
        window.dataLayer.push({ event: 'post911-status-success' });
        return dispatch({
          type: 'GET_ENROLLMENT_DATA_SUCCESS',
          data: response.data.attributes,
        });
      },
      () => {
        window.dataLayer.push({ event: 'post911-status-failure' });
        return dispatch({
          type: 'GET_ENROLLMENT_DATA_FAILURE'
        });
      }
    );
  };
}
