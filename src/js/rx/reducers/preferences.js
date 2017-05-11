import { makeField } from '../../common/model/fields';

const initialState = {
  email: makeField(''),
  flag: makeField('false'),
  loading: false,
  saving: false
};

export default function preferences(state = initialState, action) {
  switch (action.type) {
    case 'LOADING_PREFERENCES':
      return { ...state, loading: true };

    case 'SAVING_PREFERENCES':
      return { ...state, saving: true };

    case 'FETCH_PREFERENCES_SUCCESS': {
      const { emailAddress: email, rxFlag: flag } = action.preferences;
      return {
        ...state,
        email: makeField(email),
        flag: makeField(flag.toString()),
        loading: false
      };
    }

    case 'SAVE_PREFERENCES_SUCCESS': {
      return {
        email: makeField(state.email.value),
        flag: makeField(state.flag.value),
        saving: false
      };
    }

    case 'SET_NOTIFICATION_EMAIL':
      return { ...state, email: action.email };

    case 'SET_NOTIFICATION_FLAG':
      return { ...state, flag: action.flag };

    default:
      return state;
  }
}
