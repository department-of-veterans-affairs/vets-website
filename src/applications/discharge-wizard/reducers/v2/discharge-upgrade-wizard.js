import {
  DUW_VIEWED_INTRO_PAGE,
  DUW_UPDATE_SERVICE_BRANCH,
  DUW_UPDATE_DISCHARGE_YEAR,
  DUW_UPDATE_DISCHARGE_MONTH,
  DUW_UPDATE_REASON,
  DUW_UPDATE_DISCHARGE_TYPE,
  DUW_UPDATE_INTENTION,
  DUW_UPDATE_COURT_MARTIAL,
  DUW_UPDATE_FORM_STORE,
  DUW_UPDATE_PREV_APPLICATION,
  DUW_UPDATE_PREV_APPLICATION_TYPE,
  DUW_UPDATE_PREV_APPLICATION_YEAR,
  DUW_UPDATE_PRIOR_SERVICE,
} from '../../constants';

import { SHORT_NAME_MAP } from '../../constants/question-data-map';
import { createFormStore, updateFormValue } from './utilities';

const {
  SERVICE_BRANCH,
  DISCHARGE_YEAR,
  DISCHARGE_MONTH,
  REASON,
  DISCHARGE_TYPE,
  COURT_MARTIAL,
  INTENTION,
  PREV_APPLICATION,
  PREV_APPLICATION_TYPE,
  PREV_APPLICATION_YEAR,
  PRIOR_SERVICE,
} = SHORT_NAME_MAP;

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
    case DUW_UPDATE_REASON:
      return updateFormValue(REASON, state, action);
    case DUW_UPDATE_DISCHARGE_TYPE:
      return updateFormValue(DISCHARGE_TYPE, state, action);
    case DUW_UPDATE_COURT_MARTIAL:
      return updateFormValue(COURT_MARTIAL, state, action);
    case DUW_UPDATE_INTENTION:
      return updateFormValue(INTENTION, state, action);
    case DUW_UPDATE_PREV_APPLICATION:
      return updateFormValue(PREV_APPLICATION, state, action);
    case DUW_UPDATE_PREV_APPLICATION_TYPE:
      return updateFormValue(PREV_APPLICATION_TYPE, state, action);
    case DUW_UPDATE_PREV_APPLICATION_YEAR:
      return updateFormValue(PREV_APPLICATION_YEAR, state, action);
    case DUW_UPDATE_PRIOR_SERVICE:
      return updateFormValue(PRIOR_SERVICE, state, action);
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
