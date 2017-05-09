import { makeField } from '../../common/model/fields';

import {
  FETCH_PREFERENCES_FAILURE,
  FETCH_PREFERENCES_SUCCESS,
  LOADING_PREFERENCES,
  SAVE_PREFERENCES_FAILURE,
  SAVE_PREFERENCES_SUCCESS,
  SET_NOTIFICATION_EMAIL,
  SET_NOTIFICATION_FREQUENCY
} from '../utils/constants';

const initialState = {
  email: makeField(''),
  frequency: makeField('none'),
  loading: false
};

export default function preferences(state = initialState, action) {
  switch (action.type) {
    case LOADING_PREFERENCES:
      return { ...state, loading: true };

    case FETCH_PREFERENCES_SUCCESS: {
      const { emailAddress, frequency } = action.preferences;
      return {
        ...state,
        email: makeField(emailAddress),
        frequency: makeField(frequency),
        loading: false
      };
    }

    case FETCH_PREFERENCES_FAILURE:
    case SAVE_PREFERENCES_FAILURE:
      return { ...state, loading: false };

    case SAVE_PREFERENCES_SUCCESS: {
      return {
        email: makeField(state.email.value),
        frequency: makeField(state.frequency.value),
        loading: false
      };
    }

    case SET_NOTIFICATION_EMAIL:
      return { ...state, email: action.email };

    case SET_NOTIFICATION_FREQUENCY:
      return { ...state, frequency: action.frequency };

    default:
      return state;
  }
}
