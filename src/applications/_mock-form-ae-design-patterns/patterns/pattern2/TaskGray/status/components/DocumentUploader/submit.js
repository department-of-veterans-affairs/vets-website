import environment from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration } from 'platform/utilities/api';

export const submitToAPI = (state, setState) => {
  // if no file has been added, show an error message
  if (state.files.length === 0) {
    setState({
      ...state,
      errorMessage: 'Choose a file to upload.',
    });
    return;
  }
  // Show a loading indicator
  setState({
    ...state,
    submissionPending: true,
  });

  fetchAndUpdateSessionExpiration(
    `${environment.API_URL}/v0/coe/document_upload`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
        'X-CSRF-Token': state.token,
      },
      method: 'POST',
      body: JSON.stringify({
        files: state.files,
      }),
    },
  )
    .then(res => res.json())
    .then(body => {
      if (body?.errors) {
        throw new Error('error');
      } else {
        setState({
          ...state,
          files: [],
          submitted: (state.submitted || []).concat(state.files),
          errorMessage: null,
          successMessage: true,
          submissionPending: false,
        });
      }
    })
    .catch(() => {
      setState({
        ...state,
        errorMessage:
          'We’re sorry, we had a connection problem. Try again later.',
        submissionPending: false,
      });
    });
};
