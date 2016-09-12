import set from 'lodash/fp/set';
import { SET_CATEGORY } from '../actions/compose.js';

const initialState = {
  category: undefined
};

export default function compose(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORY:
      return set('category', action.value.value, state);
    default:
      return state;
  }
}
