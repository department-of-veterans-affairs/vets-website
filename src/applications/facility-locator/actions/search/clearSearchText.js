import { CLEAR_SEARCH_TEXT } from '../../utils/actionTypes';

export const clearSearchText = () => async dispatch => {
  dispatch({ type: CLEAR_SEARCH_TEXT });
};
