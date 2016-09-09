export const FETCH_FOLDERS_SUCCESS = 'FETCH_FOLDERS_SUCCESS';
export const FETCH_FOLDERS_FAILURE = 'FETCH_FOLDERS_FAILURE';
export const FETCH_FOLDER_SUCCESS = 'FETCH_FOLDER_SUCCESS';
export const FETCH_FOLDER_FAILURE = 'FETCH_FOLDER_FAILURE';

const baseUri = 'http://mock-prescriptions-api.herokuapp.com/v0/messaging/health';

export function fetchFolders() {
  return dispatch => {
    fetch(`${baseUri}/folders`)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDERS_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDERS_FAILURE, err })
    );
  };
}

export function fetchFolder(id = 1) {
  return dispatch => {
    fetch(`${baseUri}/folders/${id}/messages`)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDER_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDER_FAILURE, err })
    );
  };
}
