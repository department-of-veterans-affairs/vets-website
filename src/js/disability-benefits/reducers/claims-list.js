// import _ from 'lodash/fp';

import { SET_CLAIMS } from '../actions';

const initialState = [];

export default function claimsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIMS: {
      return action.claims;
    }
    default:
      return state;
  }
}
