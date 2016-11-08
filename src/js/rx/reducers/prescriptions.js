import assign from 'lodash/fp/assign';
import set from 'lodash/fp/set';
import _ from 'lodash';

const initialState = {
  currentItem: null,
  items: [],
  active: {
    loading: false,
    sort: 'prescriptionName'
  },
  history: {
    loading: false,
    sort: {
      value: 'refillSubmitDate',
      order: 'DESC',
    },
    page: 1,
    pages: 1
  },
  detail: {
    loading: false
  }
};

function sortByName(items) {
 /*
  Making all values the same case, to prevent
  alphabetization from getting wonky.
  */
  return items.attributes.prescriptionName.toLowerCase();
}

function sortByFacilityName(items) {
  return items.attributes.facilityName;
}

function sortByLastSubmitDate(items) {
  return new Date(items.attributes.refillSubmitDate).getTime();
}

function updateRefillStatus(items, id) {
  const itemToUpdate = items.findIndex((item) => {
    // The + converts to a number for comparison
    return +item.id === id;
  });

  // Calculate the new count, then update the items array.
  const calculateCount = items[itemToUpdate].attributes.refillRemaining - 1;
  const updateCount = set('attributes.refillRemaining', calculateCount, items[itemToUpdate]);

  // Update the refill status
  const refillStatus = set('attributes.isRefillable', false, updateCount);

  const updatedItems = set(itemToUpdate, refillStatus, items);

  return updatedItems;
}

export default function prescriptions(state = initialState, action) {
  switch (action.type) {
    case 'LOADING_ACTIVE':
      return set('active.loading', true, state);

    case 'LOADING_HISTORY':
      return set('history.loading', true, state);

    case 'LOADING_DETAIL':
      return set('detail.loading', true, state);

    case 'LOAD_PRESCRIPTION_FAILURE': {
      const loadingState = set('detail.loading', false, state);
      return set('currentItem', null, loadingState);
    }

    case 'LOAD_PRESCRIPTIONS_FAILURE': {
      const section = action.active ? 'active' : 'history';
      const loadingState = set(`${section}.loading`, false, state);
      return set('items', null, loadingState);
    }

    case 'LOAD_PRESCRIPTION_SUCCESS': {
      const loadingState = set('detail.loading', false, state);
      return set('currentItem', action.data, loadingState);
    }

    case 'LOAD_PRESCRIPTIONS_SUCCESS': {
      const sort = action.data.meta.sort;
      const sortValue = Object.keys(sort)[0];
      const sortOrder = sort[sortValue];
      const pagination = action.data.meta.pagination;
      const newState = { items: action.data.data };

      if (action.active) {
        newState.active = {
          loading: false,
          sort: sortValue
        };
      } else {
        newState.history = {
          loading: false,
          sort: { value: sortValue, order: sortOrder },
          page: pagination.currentPage,
          pages: pagination.totalPages
        };
      }

      return assign(state, newState);
    }

    case 'REFILL_SUCCESS':
      return set('items', updateRefillStatus(state.items, action.id), state);

    case 'SORT_PRESCRIPTIONS': {
      const newState = set('active.sort', action.sort, state);

      switch (action.sort) {
        case 'prescriptionName':
          return set('items', _.sortBy(state.items, sortByName), newState);
        case 'facilityName':
          return set('items', _.sortBy(state.items, sortByFacilityName), newState);
        case 'lastSubmitDate':
          return set('items', _.sortBy(state.items, sortByLastSubmitDate), newState);
        default:
          return set('active.sort', 'prescriptionName', state);
      }
    }

    default:
      return state;
  }
}
