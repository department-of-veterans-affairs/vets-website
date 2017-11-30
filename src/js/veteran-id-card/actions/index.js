import { apiRequest } from '../../common/helpers/api';

export const ATTRS_FETCHING = 'ATTRS_FETCHING';
export const ATTRS_SUCCESS = 'ATTRS_SUCCESS';
export const ATTRS_FAILURE = 'ATTRS_FAILURE';
export const REDIRECT_TIMED_OUT = 'REDIRECT_TIMED_OUT';

export function initiateIdRequest() {
  window.dataLayer.push({ event: 'vic-submit-started' });
  return dispatch => {
    dispatch({ type: ATTRS_FETCHING });

    apiRequest('/id_card/attributes',
      {},
      (response) => {
        window.dataLayer.push({ event: 'vic-submit-success' });
        dispatch({
          type: ATTRS_SUCCESS,
          vicUrl: response.url,
          traits: response.traits
        });
      },
      (response) => {
        window.dataLayer.push({ event: 'vic-submit-failure' });
        dispatch({
          type: ATTRS_FAILURE,
          errors: response.errors
        });
      }
    );
  };
}

export function timeoutRedirect() {
  return { type: REDIRECT_TIMED_OUT };
}
