import { apiRequest } from '../helpers/api';

export function checkAcceptance() {
  return dispatch => {
    dispatch({ type: 'FETCHING_MHV_TERMS_ACCEPTANCE' });

    apiRequest(
      'terms_and_conditions/mhvac/versions/latest/user_data',
      null,
      response => dispatch({
        type: 'FETCHING_MHV_TERMS_ACCEPTANCE_SUCCESS',
        accepted: response.data.attributes.created_at
      }),
      () => dispatch({ type: 'FETCHING_MHV_TERMS_ACCEPTANCE_FAILURE' })
    );
  };
}
