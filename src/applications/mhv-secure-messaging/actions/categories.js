import { Actions } from '../util/actionTypes';
import { getMessageCategoryList } from '../api/SmApi';
import { sendDatadogError } from '../util/helpers';

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
    sendDatadogError(error, 'action_categories_getCategories');
  }
};
