import { apiRequest } from '../utils/helpers';

export function getEnrollmentData() {
  return (dispatch) => {
    apiRequest('/v0/post911_gi_bill_status',
      null,
      (response) => {
        return dispatch({
          type: 'GET_ENROLLMENT_DATA_SUCCESS',
          data: response.data.attributes,
        });
      },
      () => dispatch({
        type: 'GET_ENROLLMENT_DATA_FAILURE'
      })
    );
  };
}
