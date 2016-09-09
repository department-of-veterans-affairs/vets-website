export const FETCH_FOLDER_SUCCESS = 'FETCH_FOLDER_SUCCESS';
export const FETCH_FOLDER_FAILURE = 'FETCH_FOLDER_FAILURE';

const uri = 'http://mock-prescriptions-api.herokuapp.com/v0/messaging/health/folders';

export function fetchFolders() {
  return dispatch => {
    fetch(uri)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDER_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDER_FAILURE, err })
    );
  };
}
