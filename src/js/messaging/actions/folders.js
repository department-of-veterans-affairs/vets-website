import { api } from '../config';

export const FETCH_FOLDERS_SUCCESS = 'FETCH_FOLDERS_SUCCESS';
export const FETCH_FOLDERS_FAILURE = 'FETCH_FOLDERS_FAILURE';
export const FETCH_FOLDER_SUCCESS = 'FETCH_FOLDER_SUCCESS';
export const FETCH_FOLDER_FAILURE = 'FETCH_FOLDER_FAILURE';
export const TOGGLE_FOLDER_NAV = 'TOGGLE_FOLDER_NAV';
export const TOGGLE_MANAGED_FOLDERS = 'TOGGLE_MANAGED_FOLDERS';

const baseUrl = `${api.url}/folders`;

export function fetchFolders() {
  return dispatch => {
    fetch(`${baseUrl}`, api.settings)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDERS_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDERS_FAILURE, err })
    );
  };
}

export function fetchFolder(id) {
  return dispatch => {
    fetch(`${baseUrl}/${id}/messages`, api.settings)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDER_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDER_FAILURE, err })
    );
  };
}

// Slides the folder nav out on mobile.
export function toggleFolderNav() {
  return { type: TOGGLE_FOLDER_NAV };
}

// Expands the list of named folders.
export function toggleManagedFolders() {
  return { type: TOGGLE_MANAGED_FOLDERS };
}
