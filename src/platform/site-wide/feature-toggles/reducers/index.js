import {
  TOGGLE_VALUES_SET,
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
} from '../actionTypes';

const INITIAL_STATE = {};

export const FeatureToggleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_TOGGLE_VALUES_STARTED:
      return {
        ...state,
        loading: true,
      };
    case FETCH_TOGGLE_VALUES_SUCCEEDED:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case TOGGLE_VALUES_SET:
      return {
        ...state,
        ...action.newToggleValues,
      };
    default:
      return state;
  }
};
