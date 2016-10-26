import {
  TOGGLE_ADVANCED_SEARCH,
  SET_ADVSEARCH_START_DATE,
  SET_ADVSEARCH_END_DATE
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
