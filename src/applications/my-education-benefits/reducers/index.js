import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
// import set from 'platform/utilities/data/set';

import {
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
  // FETCH_MILITARY_INFORMATION_SUCCESS,
  // FETCH_MILITARY_INFORMATION_FAILED,
} from '../actions';

const initialState = {
  formData: {},
  form: {
    data: {},
  },
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  data: (state = initialState, action) => {
    switch (action.type) {
      case FETCH_PERSONAL_INFORMATION_SUCCESS:
      case FETCH_PERSONAL_INFORMATION_FAILED:
        return {
          ...state,
          formData: action?.response || {},
          // errors: action?.response?.errors || {},
        };
      default:
        return state;
    }
  },
};
