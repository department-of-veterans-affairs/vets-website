import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of possible message categories
   * @type {array}
   */
  categories: undefined,
};

export const categoriesReducer = (state = initialState, action) => {
  if (action.type === Actions.Category.GET_LIST) {
    return {
      ...state,
      categories: action.response.data.attributes.messageCategoryType.map(
        category => {
          return category;
        },
      ),
    };
  }
  return state;
};
