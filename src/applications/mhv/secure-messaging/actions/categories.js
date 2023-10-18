import { Actions } from '../util/actionTypes';
import { getMessageCategoryList } from '../api/SmApi';

export const getCategories = () => async dispatch => {
  try {
    const response = await getMessageCategoryList();
    dispatch({
      type: Actions.Category.GET_LIST,
      response,
    });
  } catch (error) {
    dispatch({
      type: Actions.Category.GET_LIST_ERROR,
    });
  }
};
