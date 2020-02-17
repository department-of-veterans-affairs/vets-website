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
      allPeople = splitPersons(action.response.persons);
      return {
        ...state,
        loading: false,
        onAwardDependents: allPeople.onAward,
        notOnAwardDependents: allPeople.notOnAward,
      };
    case FETCH_ALL_DEPENDENTS_FAILED:
      return {
        ...state,
        allDependents: action,
      };
    default:
      return state;
  }
}

export default { allDependents };
