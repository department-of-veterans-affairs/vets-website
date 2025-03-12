import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  FETCH_FORMS_SUCCESS_NO_RESULTS,
  UPDATE_HOW_TO_SORT,
  UPDATE_PAGINATION,
  UPDATE_RESULTS,
} from '../constants';

export const fetchFormsAction = query => ({
  query,
  type: FETCH_FORMS,
});

export const fetchFormsFailure = error => ({
  error,
  type: FETCH_FORMS_FAILURE,
});

export const fetchFormsSuccess = (results, hasOnlyRetiredForms) => ({
  results,
  hasOnlyRetiredForms,
  type: FETCH_FORMS_SUCCESS,
});

export const fetchFormsSuccessNoResults = results => ({
  results,
  type: FETCH_FORMS_SUCCESS_NO_RESULTS,
});

export const updateResults = results => ({
  results,
  type: UPDATE_RESULTS,
});

export const updateSortByPropertyName = sortByPropertyName => ({
  sortByPropertyName,
  type: UPDATE_HOW_TO_SORT,
});

export const updateSortByPropertyNameThunk = (
  sortByPropertyName,
  results,
) => dispatch => {
  dispatch(updateSortByPropertyName(sortByPropertyName));
  dispatch(updateResults(results));
};

export const updatePaginationAction = (page = 1, startIndex = 0) => ({
  page,
  startIndex,
  type: UPDATE_PAGINATION,
});
