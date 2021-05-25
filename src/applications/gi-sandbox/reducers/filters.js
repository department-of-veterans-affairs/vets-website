import { INSTITUTION_FILTERS_CHANGED } from '../actions';

const INITIAL_STATE = Object.freeze({
  category: 'ALL',
  schools: true,
  employers: true,
  vettec: true,
  type: 'ALL',
  country: 'ALL',
  state: 'ALL',
  institutionType: 'ALL',
});

export default function(state = INITIAL_STATE, action) {
  let newState = { ...state };

  if (action.type === INSTITUTION_FILTERS_CHANGED) {
    newState = {
      ...newState,
      ...action.payload,
    };
  }

  return newState;
}
