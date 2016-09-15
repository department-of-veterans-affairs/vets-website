import { apiUrl } from '../config';

export const FETCH_FOLDERS_SUCCESS = 'FETCH_FOLDERS_SUCCESS';
export const FETCH_FOLDERS_FAILURE = 'FETCH_FOLDERS_FAILURE';
export const FETCH_FOLDER_SUCCESS = 'FETCH_FOLDER_SUCCESS';
export const FETCH_FOLDER_FAILURE = 'FETCH_FOLDER_FAILURE';
export const TOGGLE_FOLDER_NAV = 'TOGGLE_FOLDER_NAV';

const baseUrl = `${apiUrl}/folders`;

export function fetchFolders() {
  return dispatch => {
    fetch(`${baseUrl}`)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDERS_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDERS_FAILURE, err })
    );
  };
}

export function fetchFolder(id) {
  return dispatch => {
    fetch(`${baseUrl}/${id}/messages`)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDER_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDER_FAILURE, err })
    );
  };
}

export function toggleFolderNav() {
  return { type: TOGGLE_FOLDER_NAV };
}
