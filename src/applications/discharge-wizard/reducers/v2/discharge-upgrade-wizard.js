import {
  DUW_VIEWED_INTRO_PAGE,
  DUW_UPDATE_SERVICE_BRANCH,
  DUW_UPDATE_DISCHARGE_YEAR,
  DUW_UPDATE_DISCHARGE_MONTH,
  DUW_UPDATE_FORM_STORE,
} from '../../constants';

import { SHORT_NAME_MAP } from '../../constants/question-data-map';
import { createFormStore, updateFormValue } from './utilities';

const { SERVICE_BRANCH, DISCHARGE_YEAR, DISCHARGE_MONTH } = SHORT_NAME_MAP;

const initialState = {
  currentPage: SHORT_NAME_MAP.HOME,
  form: createFormStore(SHORT_NAME_MAP),
  viewedIntroPage: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DUW_UPDATE_SERVICE_BRANCH:
      return updateFormValue(SERVICE_BRANCH, state, action);
    case DUW_UPDATE_DISCHARGE_YEAR:
      return updateFormValue(DISCHARGE_YEAR, state, action);
    case DUW_UPDATE_DISCHARGE_MONTH:
      return updateFormValue(DISCHARGE_MONTH, state, action);
    case DUW_VIEWED_INTRO_PAGE:
      return {
        ...state,
        viewedIntroPage: action.payload,
      };
    case DUW_UPDATE_FORM_STORE:
      return {
        ...state,
        form: {
          ...state.form,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
