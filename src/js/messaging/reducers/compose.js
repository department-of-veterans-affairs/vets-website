import set from 'lodash/fp/set';
import {
  SET_CATEGORY,
  SET_SUBJECT,
  SET_SUBJECT_REQUIRED
} from '../actions/compose';

const initialState = {
  category: undefined,
  subject: {
    value: '',
    required: false
  }
};

export default function compose(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORY:
      return set('category', action.field.value, state);
    case SET_SUBJECT:
      return set('subject.value', action.field.value, state);
    case SET_SUBJECT_REQUIRED:
      return set('subject.required', action.fieldState.required, state);
    default:
      return state;
  }
}
