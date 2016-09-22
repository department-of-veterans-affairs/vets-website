import _ from 'lodash';

import { api } from '../config';

export const FETCH_FOLDERS_SUCCESS = 'FETCH_FOLDERS_SUCCESS';
export const FETCH_FOLDERS_FAILURE = 'FETCH_FOLDERS_FAILURE';
export const FETCH_FOLDER_SUCCESS = 'FETCH_FOLDER_SUCCESS';
export const FETCH_FOLDER_FAILURE = 'FETCH_FOLDER_FAILURE';
export const TOGGLE_FOLDER_NAV = 'TOGGLE_FOLDER_NAV';

const baseUrl = `${api.url}/folders`;

const createQueryString = (query) => {
  const segments = [];

  for (const key of Object.keys(query)) {
    // Linter only accepts camelCase keys, but API only
    // recognizes snake_case for query string parameters.
    const formattedKey = _.snakeCase(key);
    segments.push(`${formattedKey}=${query[key]}`);
  }

  return segments.join('&');
};

const createUrlWithQuery = (url, query) => {
  const queryString = createQueryString(query);
  const fullUrl = queryString
                ? `${baseUrl}?${queryString}`
                : baseUrl;

  return fullUrl;
};

export function fetchFolders() {
  // Get the max number of folders.
  const query = { perPage: 100 };
  const url = createUrlWithQuery(baseUrl, query);

  return dispatch => {
    fetch(`${url}`, api.settings)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_FOLDERS_SUCCESS, data }),
      err => dispatch({ type: FETCH_FOLDERS_FAILURE, err })
    );
  };
}

export function fetchFolder(id) {
  const folderUrl = `${baseUrl}/${id}`;
  const messagesUrl = `${folderUrl}/messages`;

  return dispatch => {
    Promise.all([folderUrl, messagesUrl].map(url =>
      fetch(url, api.settings).then(res => res.json())
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

export function toggleFolderNav() {
  return { type: TOGGLE_FOLDER_NAV };
}
