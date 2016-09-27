import { api } from '../config';
import { createUrlWithQuery } from '../utils/helpers';

export const FETCH_FOLDERS_SUCCESS = 'FETCH_FOLDERS_SUCCESS';
export const FETCH_FOLDERS_FAILURE = 'FETCH_FOLDERS_FAILURE';
export const FETCH_FOLDER_SUCCESS = 'FETCH_FOLDER_SUCCESS';
export const FETCH_FOLDER_FAILURE = 'FETCH_FOLDER_FAILURE';
export const TOGGLE_FOLDER_NAV = 'TOGGLE_FOLDER_NAV';
export const TOGGLE_MANAGED_FOLDERS = 'TOGGLE_MANAGED_FOLDERS';
export const CREATE_NEW_FOLDER_SUCCESS = 'CREATE_NEW_FOLDER_SUCCESS';
export const CREATE_NEW_FOLDER_FAILURE = 'CREATE_NEW_FOLDER_FAILURE';
export const SET_CURRENT_FOLDER = 'SET_CURRENT_FOLDER';

const baseUrl = `${api.url}/folders`;

export function fetchFolders() {
  // Get the max number of folders.
  const query = { perPage: 100 };
  const url = createUrlWithQuery(baseUrl, query);

  return dispatch => {
    fetch(`${url}`, api.settings.get)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDERS_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDERS_FAILURE, err })
    );
  };
}

export function fetchFolder(id, query = {}) {
  const folderUrl = `${baseUrl}/${id}`;
  const messagesUrl = createUrlWithQuery(`${folderUrl}/messages`, query);

  return dispatch => {
    Promise.all([folderUrl, messagesUrl].map(url =>
      fetch(url, api.settings.get).then(res => res.json())
    )).then(
      data => dispatch({
        type: FETCH_FOLDER_SUCCESS,
        folder: data[0],
        messages: data[1]
      }),
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

export function createNewFolder(folderName) {
  // create JSON payload
  const folderData = { folder: {} };
  folderData.folder.name = folderName;

  const settings = Object.assign({}, api.settings.post, {
    body: JSON.stringify(folderData)
  });

  return dispatch => {
    fetch(baseUrl, settings)
    .then(res => res.json())
    .then(
      data => dispatch({ type: CREATE_NEW_FOLDER_SUCCESS, data }),
      err => dispatch({ type: CREATE_NEW_FOLDER_FAILURE, err })
    );
  };
}

// Persists folder ID across threads
export function setCurrentFolder(folderId) {
  return {
    type: SET_CURRENT_FOLDER,
    folderId
  };
}
