import { Actions } from '../util/actionTypes';

/**
 * Sets Pagination in reducer where page needs to be modified by it's domain.
 */
export const setPagination = (domain, value) => async dispatch => {
  dispatch({
    type: Actions.Pagination.SET_PAGINATION,
    payload: { domain, value },
  });
};

/**
 * Resets Pagination in reducer where page needs to be modified by it's domain.
 */
export const resetPagination = url => async dispatch => {
  let domain = '';

  if (url.includes('labs-and-tests')) {
    domain = 'lab and test results';
  } else if (url.includes('allergies')) {
    domain = 'allergies';
  } else if (url.includes('vitals')) {
    domain = 'vitals';
  } else if (url.includes('conditions')) {
    domain = 'health conditions';
  } else if (url.includes('vaccines')) {
    domain = 'vaccines';
  } else if (url.includes('summaries-and-notes')) {
    domain = 'care summaries and notes';
  } else {
    domain = 'other';
  }

  dispatch({
    type: Actions.Pagination.RESET_PAGINATION,
    payload: { domain, value: 1 },
  });
};
