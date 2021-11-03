/* eslint-disable sonarjs/no-small-switch */
import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

const initialState = {
  context: {},
};

const preCheckIn = (state = initialState, action) => {
  const { context } = state;
  switch (action.type) {
    case 'TOKEN_LOADED':
      return { ...state, context: { ...context, ...action.payload } };

    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  preCheckIn,
};
