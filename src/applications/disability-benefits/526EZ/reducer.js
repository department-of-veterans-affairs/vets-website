
import _ from 'lodash/fp';

import formConfig from './config/form';
import { createSaveInProgressFormReducer } from '../../common/schemaform/save-in-progress/reducers';

import {
  SET_PRESTART_STATUS,
  RESET_PRESTART_STATUS,
  RESET_PRESTART_DISPLAY,
  PRESTART_STATUSES
} from './actions';

const initialState = {
  status: PRESTART_STATUSES.notAttempted,
  data: undefined,
  display: false
};

export const prestart = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRESTART_STATUS: {
      const newState = _.set('status', action.status, state);
      if (!state.display) {
        newState.display = true;
      }

      if (action.data && state.data) {
        const previousData = state.data;
        newState.data = {};
        newState.data.previous = previousData;
        newState.data.current = action.data;
      } else if (action.data) {
        newState.data = action.data;
      }

      return newState;
    }
    case RESET_PRESTART_STATUS: {
      let newState = _.set('status', PRESTART_STATUSES.notAttempted, state);
      newState = _.unset('data', newState);

      return newState;
    }
    case RESET_PRESTART_DISPLAY: {
      const newState = _.set('display', false, state);

      return newState;
    }
    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  prestart
};
