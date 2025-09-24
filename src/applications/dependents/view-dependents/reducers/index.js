import { removeDependents } from '../manage-dependents/redux/reducers';

import { splitPersons } from '../util';

import {
  FETCH_ALL_DEPENDENTS_SUCCESS,
  FETCH_ALL_DEPENDENTS_FAILED,
} from '../actions';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  onAwardDependents: null,
  notOnAwardDependents: null,
};

let allPeople = null;

function allDependents(state = initialState, action) {
  switch (action.type) {
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
};
