import { apiRequest } from '../../common/helpers/api';

export const ATTRS_FETCHING = 'ATTRS_FETCHING';
export const ATTRS_SUCCESS = 'ATTRS_SUCCESS';
export const ATTRS_FAILURE = 'ATTRS_FAILURE';
export const REDIRECT_TIMED_OUT = 'REDIRECT_TIMED_OUT';

export const VIC_EMAIL_CAPTURING = 'VIC_EMAIL_CAPTURING';
export const VIC_EMAIL_CAPTURE_SUCCESS = 'VIC_EMAIL_CAPTURE_SUCCESS';
export const VIC_EMAIL_CAPTURE_FAILURE = 'VIC_EMAIL_CAPTURE_FAILURE';
export const VIC_SET_EMAIL = 'VIC_SET_EMAIL';

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

export function setEmail(email) {
  return {
    type: VIC_SET_EMAIL,
    email,
  };
}

export function submitEmail(email) {
  window.dataLayer.push({ event: 'vic-email-started' });
  return dispatch => {
    dispatch({ type: VIC_EMAIL_CAPTURING });

    apiRequest('/id_card/announcement_subscription',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          id_card_announcement_subscription: {  // eslint-disable-line camelcase
            email,
          }
        })
      },
      () => {
        window.dataLayer.push({ event: 'vic-email-success' });
        dispatch({
          type: VIC_EMAIL_CAPTURE_SUCCESS,
        });
      },
      (response) => {
        window.dataLayer.push({ event: 'vic-email-failure' });
        dispatch({
          type: VIC_EMAIL_CAPTURE_FAILURE,
          errors: response.errors
        });
      }
    );
  };
}
