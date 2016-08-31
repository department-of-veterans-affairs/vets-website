import set from 'lodash/fp/set';
import _ from 'lodash';

const initialState = {
  currentItem: null,
  items: []
};

function sortByName(obj) {
 /*
  Making all values the same case, to prevent
  alphabetization from getting wonky.
  */
  return obj.attributes['prescription-name'].toLowerCase();
}

function sortByFacilityName(obj) {
  return obj.attributes['facility-name'];
}

function sortByLastRequested(obj) {
  return new Date(obj.attributes['refill-date']).getTime();
}

export default function prescriptions(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_PRESCRIPTIONS_SUCCESS':
      return set('items', action.data.data, state);
    case 'LOAD_PRESCRIPTION_SUCCESS':
      return set('currentItem', action.data.data, state);
    // After the data is loaded, we can just use `state`.
    // Also breaking convention and using lower case because the query parameters
    // are lower case.
    case 'prescription-name':
      return set('items', _.sortBy(state.items, sortByName), state);
    case 'facility-name':
      return set('items', _.sortBy(state.items, sortByFacilityName), state);
    case 'last-requested':
      return set('items', _.sortBy(state.items, sortByLastRequested), state);
    default:
      return state;
  }
}
