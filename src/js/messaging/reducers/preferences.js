import { makeField } from '../../common/model/fields';

import {
  FETCH_PREFERENCES_SUCCESS,
  SAVE_PREFERENCES_SUCCESS,
  SET_NOTIFICATION_EMAIL,
  SET_NOTIFICATION_FREQUENCY
} from '../utils/constants';

const initialState = {
  emailAddress: makeField(''),
  frequency: makeField('none')
};

export default function preferences(state = initialState, action) {
  switch (action.type) {
    case FETCH_PREFERENCES_SUCCESS: {
      const { emailAddress, frequency } = action.preferences;
      return {
        ...state,
        emailAddress: makeField(emailAddress),
        frequency: makeField(frequency)
      };
    }

    case SAVE_PREFERENCES_SUCCESS: {
      return {
        emailAddress: makeField(state.email.value),
        frequency: makeField(state.frequency.value)
      };
    }

    case SET_NOTIFICATION_EMAIL:
      return { ...state, emailAddress: action.email };

    case SET_NOTIFICATION_FREQUENCY:
      return { ...state, frequency: action.frequency };

    default:
      return state;
  }
}
