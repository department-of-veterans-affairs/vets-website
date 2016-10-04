export const TOGGLE_ADVANCED_SEARCH = 'TOGGLE_ADVANCED_SEARCH';
export const SET_ADVSEARCH_START_DATE = 'SET_ADVSEARCH_START_DATE';
export const SET_ADVSEARCH_END_DATE = 'SET_ADVSEARCH_END_DATE';

export function toggleAdvancedSearch() {
  return {
    type: TOGGLE_ADVANCED_SEARCH
  };
}

export function setDateRange(date, start = true) {
  const mode = (start === true) ? SET_ADVSEARCH_START_DATE : SET_ADVSEARCH_END_DATE;
  return {
    type: mode,
    date
  };
}
