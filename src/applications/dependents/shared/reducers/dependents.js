import {
  DEPENDENTS_FETCH_STARTED,
  DEPENDENTS_FETCH_SUCCESS,
  DEPENDENTS_FETCH_FAILED,
} from '../actions';

import { processDependents } from '../../dependents-verification/helpers';

const initialState = {
  loading: true,
  error: null,
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DEPENDENTS_FETCH_STARTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DEPENDENTS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: processDependents(action.data),
      };
    case DEPENDENTS_FETCH_FAILED:
      return {
        ...state,
        loading: false,
        error: action.data.error,
      };
    default:
      return state;
  }
};
