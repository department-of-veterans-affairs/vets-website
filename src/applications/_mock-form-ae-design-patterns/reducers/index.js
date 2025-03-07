/* eslint-disable no-console */
import {
  createSaveInProgressFormReducer,
  createSaveInProgressInitialState,
} from 'platform/forms/save-in-progress/reducers';
import { createInitialState } from 'platform/forms-system/src/js/state/helpers';
import vapService from '@@vap-svc/reducers';
import formConfig from '../shared/config/fallbackForm';
import {
  SET_NEW_FORM_CONFIG,
  UPDATE_SAVE_TO_PROFILE,
  SET_MISSING_INFO,
  REMOVE_MISSING_FIELD,
} from '../actions/actions';

import { vadxReducer } from '../slice';

const initialState = {
  saveToProfile: null,
  missingInfo: [],
};

const reducer = (state = initialState, action) => {
  if (action.type === SET_NEW_FORM_CONFIG) {
    if (action.formConfig.trackingPrefix === state?.trackingPrefix) {
      return state;
    }
    const newState = createInitialState(action.formConfig);
    return {
      ...state,
      ...createSaveInProgressInitialState(action.formConfig, newState),
    };
  }

  if (action.type === UPDATE_SAVE_TO_PROFILE) {
    return {
      ...state,
      saveToProfile: action.payload,
    };
  }

  if (action.type === SET_MISSING_INFO) {
    return {
      ...state,
      missingInfo: action.payload,
    };
  }

  if (action.type === REMOVE_MISSING_FIELD) {
    return {
      ...state,
      missingInfo: state.missingInfo.filter(field => field !== action.payload),
    };
  }

  return createSaveInProgressFormReducer(formConfig)(
    { ...createInitialState(formConfig), ...state },
    action,
  );
};

export default {
  form: reducer,
  vapService,
  vadx: vadxReducer,
};
