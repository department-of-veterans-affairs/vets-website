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
export const resetPagination = domain => async dispatch => {
  let url = '';

  if (domain.includes('labs-and-tests')) {
    url = 'lab and test results';
  } else if (domain.includes('allergies')) {
    url = 'allergies';
  } else if (domain.includes('vitals')) {
    url = 'vitals';
  } else if (domain.includes('conditions')) {
    url = 'health conditions';
  } else if (domain.includes('vaccines')) {
    url = 'vaccines';
  } else if (domain.includes('summaries-and-notes')) {
    url = 'care summaries and notes';
  } else {
    url = 'other';
  }

  dispatch({
    type: Actions.Pagination.RESET_PAGINATION,
    payload: { domain: url, value: 1 },
  });
};
