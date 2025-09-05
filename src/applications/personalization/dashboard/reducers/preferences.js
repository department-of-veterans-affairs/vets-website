import set from 'platform/utilities/data/set';
import { SET_MYVA_LAYOUT_PREFERENCE } from '../actions/preferences';

const initialState = {};

export default function preferencesReducer(state = initialState, action) {
  if (action.type === SET_MYVA_LAYOUT_PREFERENCE) {
    return set('layout.version', action.layout.version, state);
  }

  return state;
}
