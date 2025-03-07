import createSchemaFormReducer from 'platform/forms-system/src/js/state';
import { createInitialState } from 'platform/forms-system/src/js/state/helpers';
import reducers from 'platform/forms-system/src/js/state/reducers';
import {
  saveInProgressReducers,
  createSaveInProgressInitialState,
} from 'platform/forms/save-in-progress/reducers';
import migrations from './migrations';

const SET_FORM_VERSION = 'SET_FORM_VERSION';

export function setFormVersion(version) {
  return {
    type: SET_FORM_VERSION,
    version,
  };
}

const additionalReducers = {
  [SET_FORM_VERSION]: (state, action) => ({
    ...state,
    migrations: migrations.slice(0, action.version),
    version: action.version,
  }),
};

export function createSaveInProgressFormReducer(formConfig) {
  let formReducers = reducers;
  let initialState = createInitialState(formConfig);

  if (!formConfig.disableSave) {
    formReducers = {
      ...formReducers,
      ...saveInProgressReducers,
      ...additionalReducers,
    };
    initialState = createSaveInProgressInitialState(formConfig, initialState);
  }

  return createSchemaFormReducer(formConfig, initialState, formReducers);
}
