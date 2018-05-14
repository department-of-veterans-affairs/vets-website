import {
  createInitialState,
} from '../state/helpers';

import {
  createSaveInProgressInitialState,
  saveInProgressReducers
} from '../save-in-progress/reducers';

import reducers from '../state/reducers';

export default function createSchemaFormReducer(formConfig) {
  let initialState = createInitialState(formConfig);
  let formReducers = reducers;

  if (!formConfig.disableSave) {
    formReducers = Object.assign({}, formReducers, saveInProgressReducers);
    initialState = createSaveInProgressInitialState(formConfig, initialState);
  }

  return (state = initialState, action) => {
    const reducer = formReducers[action.type];

    if (reducer) {
      return reducer(state, action);
    }

    return state;
  };
}
