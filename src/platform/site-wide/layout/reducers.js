import set from 'platform/utilities/data/set';
import { UPDATE_HEADER_TYPE } from './actions';

const initialState = {};

export default function layoutReducer(state = initialState, action) {
  if (action.type === UPDATE_HEADER_TYPE) {
    return set('header.type', action.header.type, state);
  }

  return state;
}
