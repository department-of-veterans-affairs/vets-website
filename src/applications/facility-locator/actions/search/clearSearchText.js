import { CLEAR_SEARCH_TEXT } from '../actionTypes';

export const clearSearchText = () => async dispatch => {
  dispatch({ type: CLEAR_SEARCH_TEXT });
};
