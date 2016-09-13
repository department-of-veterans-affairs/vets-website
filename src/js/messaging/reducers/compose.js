import set from 'lodash/fp/set';
import { SET_CATEGORY, SET_SUBJECT } from '../actions/compose.js';

const initialState = {
  category: undefined,
  subject: ''
};

export default function compose(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORY:
      return set('category', action.value.value, state);
    case SET_SUBJECT:
      return set('subject', action.value.value, state);
    default:
      return state;
  }
}
