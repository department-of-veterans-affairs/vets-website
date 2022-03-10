import environment from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration } from 'platform/utilities/api';

export const submitToAPI = (state, setState) => {
  // if no file has been added, show an error message
  if (state.files.length === 0) {
    setState({
      ...state,
      errorMessage: 'Please choose a file to upload.',
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
        setState({
          ...state,
          files: [],
          errorMessage:
            "We're sorry, we had a connection problem. Please try again later.",
          submissionPending: false,
        });
      } else {
        setState({
          ...state,
          files: [],
          errorMessage: null,
          successMessage: true,
          submissionPending: false,
        });
      }
    });
};
