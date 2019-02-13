export const SUBMIT_ID_FORM_STARTED = 'SUBMIT_ID_FORM_STARTED';
export const SUBMIT_ID_FORM_SUCCEEDED = 'SUBMIT_ID_FORM_SUCCEEDED';
export const SUBMIT_ID_FORM_FAILED = 'SUBMIT_ID_FORM_FAILED';

// eslint-disable-next-line no-unused-vars
export function submitIDForm(formData) {
  return dispatch => {
    dispatch({
      type: SUBMIT_ID_FORM_STARTED,
    });

    // TODO: actually call the form ID endpoint and dispatch
    // SUBMIT_ID_FORM_FAILED or SUBMIT_ID_FORM_SUCCEEDED depending on how it
    // resolves
    setTimeout(() => {
      dispatch({
        // type: 'SUBMIT_ID_FORM_SUCCEEDED',
        type: SUBMIT_ID_FORM_FAILED,
        error: 'oh noes!!!!',
      });
    }, 2000);
  };
}
