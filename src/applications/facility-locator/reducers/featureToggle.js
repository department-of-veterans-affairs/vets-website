import {
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
} from '../utils/actionTypes';

const INITIAL_STATE = {};

export const FeatureToggleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_TOGGLE_VALUES_STARTED:
      return state;
    case FETCH_TOGGLE_VALUES_SUCCEEDED:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
