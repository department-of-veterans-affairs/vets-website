import { removeDependents } from '../manage-dependents/redux/reducers';
import ratingValue from './ratingInfo';

import { splitPersons } from '../util';

import {
  FETCH_ALL_DEPENDENTS_STARTED,
  FETCH_ALL_DEPENDENTS_SUCCESS,
  FETCH_ALL_DEPENDENTS_FAILED,
} from '../actions';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  onAwardDependents: [],
  notOnAwardDependents: [],
};

let allPeople = null;

/**
 * @typedef {object} AllDependentsState
 * @property {boolean} loading - whether data is loading
 * @property {object|null} error - error object
 * @property {Array|null} onAwardDependents - list of dependents on award
 * @property {Array|null} notOnAwardDependents - list of dependents not on award
 *
 * @typedef {object} AllDependentsAction
 * @property {string} type - action type
 * @property {object} response - API response object
 * @property {object} error - error object
 *
 * All dependents reducer
 * @param {AllDependentsState} state - redux state
 * @param {AllDependentsAction} action - redux action
 * @returns {AllDependentsState} - updated redux state
 */
function allDependents(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL_DEPENDENTS_STARTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ALL_DEPENDENTS_SUCCESS:
      if (action.response.persons && action.response.persons.length > 0) {
        allPeople = splitPersons(action.response.persons);
        return {
          ...state,
          loading: false,
          onAwardDependents: allPeople.onAward,
          notOnAwardDependents: allPeople.notOnAward,
        };
      }
      // API succeeded but no dependents
      return {
        ...state,
        loading: false,
      };

    case FETCH_ALL_DEPENDENTS_FAILED:
      // We are assigning the 'status' to the state variable 'code' because the API calls it a status
      // but in the application we treat it as an error code
      return {
        ...state,
        loading: false,
        error: {
          code: action.response.errors[0].status,
        },
      };
    default:
      return state;
  }
}

export default {
  allDependents,
  removeDependents,
  ratingValue,
};
