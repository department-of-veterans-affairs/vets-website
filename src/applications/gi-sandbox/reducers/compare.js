import _ from 'lodash';
import {
  ADD_COMPARE_INSTITUTION,
  REMOVE_COMPARE_INSTITUTION,
} from '../actions';

const INITIAL_STATE = Object.freeze({
  institutions: {},
  loaded: [],
  promptingToRemove: null,
});

export default function(state = INITIAL_STATE, action) {
  let newState = { ...state };

  if (action.type === ADD_COMPARE_INSTITUTION && state.loaded.length < 3) {
    newState = {
      loaded: [...newState.loaded, action.payload.facilityCode],
      institutions: {
        ...newState.institutions,
        [action.payload.facilityCode]: action.payload,
      },
    };
  }

  if (action.type === REMOVE_COMPARE_INSTITUTION) {
    newState = {
      loaded: newState.loaded.filter(
        facilityCode => facilityCode !== action.payload,
      ),
      institutions: {
        ..._.omit(newState.institutions, action.payload),
      },
    };
  }

  return newState;
}
