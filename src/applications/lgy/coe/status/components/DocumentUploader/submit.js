import environment from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration } from 'platform/utilities/api';

export const submitToAPI = (files, token, dispatch, actions) => {
  if (files.length === 0) {
    dispatch({
      type: actions.FORM_SUBMIT_FAIL,
      errorMessage: 'Please choose a file to upload.',
    });
    return;
  }
  dispatch({
    type: actions.FORM_SUBMIT_PENDING,
  });

  fetchAndUpdateSessionExpiration(
    `${environment.API_URL}/v0/coe/document_upload`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
        'X-CSRF-Token': token,
      },
      method: 'POST',
      body: JSON.stringify({
        files,
      }),
    },
  )
    .then(res => res.json())
    .then(body => {
      if (body?.errors) {
        dispatch({
          type: actions.FORM_SUBMIT_FAIL,
          errorMessage:
            "We're sorry, we had a connection problem. Please try again later.",
        });
      } else {
        dispatch({
          type: actions.FORM_SUBMIT_SUCCESS,
        });
      }
    });
};
