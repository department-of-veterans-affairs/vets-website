import _ from 'lodash';
import {
  ACCEPT_COMPARE_INSTITUTION_REMOVAL_PROMPT,
  ADD_COMPARE_INSTITUTION,
  CANCEL_COMPARE_INSTITUTION_REMOVAL_PROMPT,
  REMOVE_COMPARE_INSTITUTION,
  PROMPT_TO_REMOVE_COMPARE_INSTITUTION,
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

  if (action.type === PROMPT_TO_REMOVE_COMPARE_INSTITUTION) {
    newState = {
      ...newState,
      promptingToRemove: action.payload.facilityCode,
    };
  }

  if (action.type === ACCEPT_COMPARE_INSTITUTION_REMOVAL_PROMPT) {
    newState = {
      ...newState,
      promptingToRemove: null,
    };
  }

  if (action.type === CANCEL_COMPARE_INSTITUTION_REMOVAL_PROMPT) {
    newState = {
      ...newState,
      promptingToRemove: null,
    };
  }

  return newState;
}
