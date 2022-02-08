import {
  FETCH_FACILITY_FAILED,
  FETCH_FACILITY_STARTED,
  FETCH_FACILITY_SUCCESS,
  FETCH_MULTI_FACILITY_SUCCESS,
} from '../actions';

const initialState = {
  loading: false,
  data: {},
  multidata: {},
  error: false,
};

export function facilityReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FACILITY_STARTED:
      return { multidata: {}, data: {}, loading: true, error: false };
    case FETCH_FACILITY_SUCCESS:
      return {
        multidata: state.multidata,
        data: action.facility,
        loading: false,
        error: false,
      };
    case FETCH_MULTI_FACILITY_SUCCESS: {
      const tempData = {};
      tempData[action.facilityID] = action.facility;
      return {
        multidata: tempData,
        data: state.data,
        loading: false,
        error: false,
      };
    }
    case FETCH_FACILITY_FAILED:
      return { multidata: {}, data: {}, loading: false, error: true };
    default:
      return state;
  }
}

export default {
  facility: facilityReducer,
};
