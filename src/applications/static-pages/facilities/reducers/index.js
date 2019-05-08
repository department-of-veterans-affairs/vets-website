import {
  FETCH_FACILITY_FAILED,
  FETCH_FACILITY_STARTED,
  FETCH_FACILITY_SUCCESS,
} from '../actions';

const initialState = {
  loading: false,
  data: {},
  error: false,
};

export function facilityReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FACILITY_STARTED:
      return { data: {}, loading: true, error: false };
    case FETCH_FACILITY_SUCCESS:
      return { data: action.facility, loading: false, error: false };
    case FETCH_FACILITY_FAILED:
      return { data: {}, loading: false, error: true };
    default:
      return state;
  }
}

export default {
  facility: facilityReducer,
};
