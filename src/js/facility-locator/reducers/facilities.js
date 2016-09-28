import { FETCH_VA_FACILITY, FETCH_VA_FACILITIES } from '../actions';

const INITIAL_STATE = { facilities: [], selectedFacility: null };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_VA_FACILITY:
      return {
        ...state,
        selectedFacility: action.payload,
      };
    case FETCH_VA_FACILITIES:
      return {
        ...state,
        facilities: action.payload,
      };
    default:
      return state;
  }
}
