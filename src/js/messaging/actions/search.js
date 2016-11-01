import { api } from '../config';
import { createQueryString } from '../utils/helpers';

import {
  FOLDER_SEARCH_SUCCESS,
  FOLDER_SEARCH_FAILURE,
  SET_ADVSEARCH_START_DATE,
  SET_ADVSEARCH_END_DATE,
  SET_SEARCH_PARAM,
  TOGGLE_ADVANCED_SEARCH,
} from '../utils/constants';

const baseUrl = `${api.url}/folders`;

export function toggleAdvancedSearch() {
  return {
    type: TOGGLE_ADVANCED_SEARCH
  };
}

export function setDateRange(date, start = true) {
  const mode = start
             ? SET_ADVSEARCH_START_DATE
             : SET_ADVSEARCH_END_DATE;

  return {
    type: mode,
    date
  };
}

export function setSearchParam(path, field) {
  return {
    type: SET_SEARCH_PARAM,
    path,
    field
  };
}

export function sendSearch(folderId, query) {
  const queryString = createQueryString(query, false);
  const searchUrl = `${baseUrl}/${folderId}/messages?${queryString}`;

  return dispatch => {
    fetch(searchUrl, api.settings.get)
    .then(response => {
      return response.json();
    }).then(
      data => {
        if (data.errors) {
          return dispatch({
            type: FOLDER_SEARCH_FAILURE,
            error: data.errors
          });
        }

        return dispatch({
          type: FOLDER_SEARCH_SUCCESS,
          messages: data
        });
      },
      error => dispatch({ type: FOLDER_SEARCH_FAILURE, error })
    );
  };
}
