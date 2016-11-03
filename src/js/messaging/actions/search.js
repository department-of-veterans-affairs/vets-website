import {
  SET_ADVSEARCH_START_DATE,
  SET_ADVSEARCH_END_DATE,
  SET_SEARCH_PARAM,
  TOGGLE_ADVANCED_SEARCH,
} from '../utils/constants';

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
