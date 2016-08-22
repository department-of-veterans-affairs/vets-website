import set from 'lodash/fp/set';
import _ from 'lodash';

const initialState = { items: [] };

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
  return new Date(obj.attributes['ordered-date']).getTime();
}

export default function prescriptions(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_PRESCRIPTIONS_SUCCESS':
      return set('items', action.data.data, state);
    // After the data is loaded, we can just use `state` here.
    case 'SORT_PRESCRIPTION_NAME':
      return set('items', _.sortBy(state.items, sortByName), state);
    case 'SORT_FACILITY_NAME':
      return set('items', _.sortBy(state.items, sortByFacilityName), state);
    case 'SORT_LAST_REQUESTED':
      return set('items', _.sortBy(state.items, sortByLastRequested), state);
    default:
      return state;
  }
}
