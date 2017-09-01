import { apiRequest } from '../../common/helpers/api';

export const BETA_REGISTERING = 'BETA_REGISTERING';
export const BETA_REGISTER_SUCCESS = 'BETA_REGISTER_SUCCESS';
export const BETA_REGISTER_FAILURE = 'BETA_REGISTER_FAILURE';

export function initiateIdRequest() {
  return dispatch => {
    dispatch({ type: BETA_REGISTERING });

    apiRequest('/id_card_attributes',
      { redirect: 'follow' },
      (response) => dispatch({
        type: BETA_REGISTER_SUCCESS,
        redirect: response.redirect,
      }),
      (response) => dispatch({
        type: BETA_REGISTER_FAILURE,
        errors: response.errors
      })
    );
  };
}

