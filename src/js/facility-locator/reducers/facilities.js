import { FETCH_VA_FACILITY, FETCH_VA_FACILITIES } from '../actions';

const INITIAL_STATE = { facilities: [], facilityDetail: null };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_VA_FACILITY:
      return {
        ...state,
        facilityDetail: action.payload,
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
