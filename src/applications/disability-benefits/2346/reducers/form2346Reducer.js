import {
  FETCH_ACCESSORIES_DATA_FAILURE,
  FETCH_ACCESSORIES_DATA_SUCCESS,
  FETCH_BATTERY_DATA_FAILURE,
  FETCH_BATTERY_DATA_SUCCESS,
  FETCH_VETERAN_ADDRESS_FAILURE,
  FETCH_VETERAN_ADDRESS_SUCCESS,
  // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
  // FETCH_SOCKS_DATA_FAILURE,
  // FETCH_SOCKS_DATA_SUCCESS,
  UPDATE_DATA_FAILURE,
  UPDATE_DATA_SUCCESS,
} from '../constants';

const initialState = {
  dlcBatteryData: [],
  // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
  // dlcSocksData: [],
  dlcAccessoriesData: [],
  formData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BATTERY_DATA_SUCCESS:
      return {
        ...state,
        dlcBatteryData: action.data,
      };

    case FETCH_BATTERY_DATA_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
    // case FETCH_SOCKS_DATA_SUCCESS:
    //   return {
    //     ...state,
    //     dlcSocksData: action.data,
    //   };

    // case FETCH_SOCKS_DATA_FAILURE:
    //   return {
    //     ...state,
    //     error: action.error,
    //   };

    case FETCH_ACCESSORIES_DATA_SUCCESS:
      return {
        ...state,
        dlcAccessoriesData: action.data,
      };

    case FETCH_ACCESSORIES_DATA_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case UPDATE_DATA_SUCCESS:
      return {
        ...state,
        dlcData: state.data.concat(action.data),
      };

    case UPDATE_DATA_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    case FETCH_VETERAN_ADDRESS_SUCCESS:
      return {
        ...state,
        formData: action.data,
      };

    case FETCH_VETERAN_ADDRESS_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};
