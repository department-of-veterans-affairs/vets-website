import assign from 'lodash/fp/assign';
import set from 'lodash/fp/set';
import _ from 'lodash';

const initialState = {
  currentItem: null,
  items: [],
  history: {
    sort: {
      value: 'ordered-date',
      order: 'DESC',
    },
    page: 1,
    pages: 1
  }
};

function sortByName(items) {
 /*
  Making all values the same case, to prevent
  alphabetization from getting wonky.
  */
  return items.attributes['prescription-name'].toLowerCase();
}

function sortByFacilityName(items) {
  return items.attributes['facility-name'];
}

function sortByLastRequested(items) {
  return new Date(items.attributes['refill-date']).getTime();
}

function updateRefillStatus(items, id) {
  const itemToUpdate = items.findIndex((item) => {
    // The + converts to a number for comparison
    return +item.id === id;
  });

  // Calculate the new count, then update the items array.
  const calculateCount = items[itemToUpdate].attributes['refill-remaining'] - 1;
  const updateCount = set('attributes[refill-remaining]', calculateCount, items[itemToUpdate]);

  // Update the refill status
  const refillStatus = set('attributes[is-refillable]', false, updateCount);

  const updatedItems = set(itemToUpdate, refillStatus, items);

  return updatedItems;
}

export default function prescriptions(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_PRESCRIPTIONS_SUCCESS': {
      const sort = action.data.meta.sort;
      const sortValue = Object.keys(sort)[0];
      const sortOrder = sort[sortValue];

      const pagination = action.data.meta.pagination;

      return assign(state, {
        items: action.data.data,
        history: {
          sort: { value: sortValue, order: sortOrder },
          page: pagination['current-page'],
          pages: pagination['total-pages']
        }
      });
    }
    case 'LOAD_PRESCRIPTION_SUCCESS':
      return set('currentItem', action.data, state);
    // After the data is loaded, we can just use `state`.
    // Also breaking convention and using lower case because the query parameters
    // are lower case.
    case 'prescription-name':
      return set('items', _.sortBy(state.items, sortByName), state);
    case 'facility-name':
      return set('items', _.sortBy(state.items, sortByFacilityName), state);
    case 'last-requested':
      return set('items', _.sortBy(state.items, sortByLastRequested), state);
    case 'REFILL_SUCCESS':
      return set('items', updateRefillStatus(state.items, action.id), state);
    default:
      return state;
  }
}
