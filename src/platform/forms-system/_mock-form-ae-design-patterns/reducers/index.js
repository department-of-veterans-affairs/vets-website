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
} from '../actions/actions';

// VADX reducer for app route (WIP)
import { vadxReducer } from '../slice';

const reducer = (state = { saveToProfile: null }, action) => {
  if (action.type === SET_NEW_FORM_CONFIG) {
    // only reset the form if the new form config has a different tracking prefix (this was the easiest way to determine if the form config changed)
    if (action.formConfig.trackingPrefix === state?.trackingPrefix) {
      return state;
    }
    const initialState = createInitialState(action.formConfig);
    const updated = createSaveInProgressInitialState(
      action.formConfig,
      initialState,
    );
    return { ...state, ...updated };
  }

  if (action.type === UPDATE_SAVE_TO_PROFILE) {
    return {
      ...state,
      saveToProfile: action.payload,
    };
  }

  const initialState = createInitialState(formConfig);
  return createSaveInProgressFormReducer(formConfig)(
    { ...initialState, ...state },
    action,
  );
};

export default {
  form: reducer,
  vapService,
  vadx: vadxReducer,
};
