import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

import { SET_CATEGORY_ID, SET_TOPIC_ID } from '../actions';

const initialState = {
  categoryID: '',
  topicID: '',
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  askVA: (state = initialState, action) => {
    switch (action.type) {
      case SET_CATEGORY_ID:
        return {
          ...state,
          categoryID: action.payload,
        };
      case SET_TOPIC_ID:
        return {
          ...state,
          topicID: action.payload,
        };
      default:
        return state;
    }
  },
};
