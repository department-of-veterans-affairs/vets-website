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
  dispatch({
    type: Actions.Pagination.RESET_PAGINATION,
    payload: { domain },
  });
};
