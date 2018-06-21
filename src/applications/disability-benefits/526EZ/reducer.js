
import _ from 'lodash/fp';

import formConfig from './config/form';
import { createSaveInProgressFormReducer } from '../../../platform/forms/save-in-progress/reducers';

import {
  PRESTART_STATUS_SET,
  PRESTART_DATA_SET,
  PRESTART_STATE_RESET,
  PRESTART_DISPLAY_RESET,
  PRESTART_STATUSES
} from './actions';

const initialState = {
  status: PRESTART_STATUSES.notAttempted,
  data: {
    verificationType: null,
    currentExpirationDate: null,
    previousExpirationDate: null,
    type: null
  },
  display: false
};

export const prestart = (state = initialState, action) => {
  switch (action.type) {
    case PRESTART_STATUS_SET: {
      const newState = _.set('status', action.status, state);
      newState.display = true;
      return newState;
    }
    case PRESTART_DATA_SET: {
      return _.set('data', action.data, state);
    }
    case PRESTART_STATE_RESET: {
      return initialState;
    }
    case PRESTART_DISPLAY_RESET: {
      return _.set('display', false, state);
    }
    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  prestart
};
