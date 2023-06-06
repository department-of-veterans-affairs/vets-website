import { Actions } from '../util/actionTypes';
import { getMessageCategoryList } from '../api/SmApi';

export const getCategories = () => async dispatch => {
  const response = await getMessageCategoryList();
  // TODO Add error handling
  dispatch({
    type: Actions.Category.GET_LIST,
    response,
  });
};
