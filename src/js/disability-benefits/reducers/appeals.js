import _ from 'lodash/fp';

import {
  SET_APPEALS,
  SET_APPEALS_UNAVAILABLE,
} from '../actions';

const initialState = {
  available: true,
};

export default function appealsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_APPEALS:
      return _.set('available', true, state);
    case SET_APPEALS_UNAVAILABLE:
      return _.set('available', false, state);
    default:
      return state;
  }
}
