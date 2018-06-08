
import _ from 'lodash/fp';

import formConfig from './config/form';
import { createSaveInProgressFormReducer } from '../../common/schemaform/save-in-progress/reducers';

import {
  SET_PRESTART_STATUS,
  UNSET_PRESTART_STATUS,
  UNSET_PRESTART_DISPLAY,
  PRESTART_STATUSES
} from './actions';

const initialState = {
  status: PRESTART_STATUSES.notAttempted
};

const prestart = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRESTART_STATUS: {
      const newState = _.set('status', action.status, state);
      newState.display = true;

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
    case UNSET_PRESTART_STATUS: {
      let newState = _.set('status', PRESTART_STATUSES.notAttempted, state);
      newState = _.unset('data', newState);

      return newState;
    }
    case UNSET_PRESTART_DISPLAY: {
      const newState = _.unset('display', state);

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
