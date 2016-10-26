import { api } from '../config';

import {
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
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

export function sendSearch(params, folderId = 0) {
  const term = params.term.value;
  const from = params.from;
  const subject = params.subject;
  const dateRange = params.dateRange;
  const filters = [];

  if (params.term.value) {
    filters.push(`filter[[subject][match]]=${term}`);
  }

  if (from.field.value) {
    const fromExact = from.exact ? 'eq' : 'match';
    filters.push(`filter[[sender_name][${fromExact}]]=${params.from.field.value}`);
  }

  if (subject.field.value) {
    const subjectExact = subject.exact ? 'eq' : 'match';
    filters.push(`filter[[subject][${subjectExact}]]=${params.subject.field.value}`);
  }

  if (dateRange.start) {
    filters.push(`filter[[sent_date][gteq]]=${dateRange.start.format()}`);
  }

  if (dateRange.end) {
    filters.push(`filter[[sent_date][lteq]]=${dateRange.end.format()}`);
  }

  const searchURL = `${baseUrl}/${folderId}/messages?${filters.join('&')}`;

  return dispatch => {
    fetch(searchURL, api.settings.get)
    .then(response => {
      return response.json();
    }).then(
      data => {
        if (data.errors) {
          return dispatch({
            type: SEARCH_FAILURE,
            error: data.errors
          });
        }

        return dispatch({
          type: SEARCH_SUCCESS,
          messages: data
        });
      },
      error => dispatch({ type: SEARCH_FAILURE, error })
    );
  };
}
