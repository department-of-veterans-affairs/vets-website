import _ from 'lodash/fp';

import { SET_CLAIMS, FILTER_CLAIMS, SORT_CLAIMS, CHANGE_CLAIMS_PAGE, SHOW_CONSOLIDATED_MODAL, HIDE_30_DAY_NOTICE } from '../actions';

const ROWS_PER_PAGE = 10;

const initialState = {
  list: null,
  visibleList: [],
  visibleRows: [],
  page: 1,
  pages: 1,
  sortProperty: 'phaseChangeDate',
  consolidatedModal: false,
  show30DayNotice: true
};

// We want to sort claims without dates below claims with dates
function phaseChangeDate(claim) {
  return claim.attributes && claim.attributes.phaseChangeDate
    ? claim.attributes.phaseChangeDate
    : '0';
}

function dateFiled(claim) {
  return claim.attributes && claim.attributes.dateFiled
    ? claim.attributes.dateFiled
    : '0';
}

function claimType(claim) {
  return claim.attributes && claim.attributes.claimType
    ? claim.attributes.claimType.toLowerCase()
    : '';
}

const sortPropertyFn = {
  phaseChangeDate,
  dateFiled,
  claimType
};

function filterList(list, filter) {
  let filteredList = list;
  if (filter) {
    const open = filter === 'open';
    filteredList = filteredList.filter((claim) => {
      return claim.attributes.open === open;
    });
  }
  return filteredList;
}

function sortList(list, sortProperty) {
  return _.orderBy([sortPropertyFn[sortProperty], 'id'], 'desc', list);
}

function getVisibleRows(list, currentPage) {
  const currentIndex = (currentPage - 1) * ROWS_PER_PAGE;
  return list.slice(currentIndex, currentIndex + ROWS_PER_PAGE);
}

function getTotalPages(list) {
  return Math.ceil(list.length / ROWS_PER_PAGE);
}

export default function claimsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIMS: {
      const visibleList = sortList(filterList(action.claims, action.filter), state.sortProperty);
      return _.assign(state, {
        list: action.claims,
        visibleList,
        visibleRows: getVisibleRows(visibleList, state.page),
        pages: getTotalPages(visibleList)
      });
    }
    case FILTER_CLAIMS: {
      const visibleList = sortList(filterList(state.list, action.filter), state.sortProperty);
      return _.assign(state, {
        visibleList,
        visibleRows: getVisibleRows(visibleList, 1),
        page: 1,
        pages: getTotalPages(visibleList)
      });
    }
    case SORT_CLAIMS: {
      const visibleList = sortList(state.visibleList, action.sortProperty);
      return _.assign(state, {
        sortProperty: action.sortProperty,
        visibleList,
        visibleRows: getVisibleRows(visibleList, 1),
        page: 1,
        pages: getTotalPages(visibleList)
      });
    }
    case CHANGE_CLAIMS_PAGE: {
      const current = (action.page - 1) * ROWS_PER_PAGE;
      return _.assign(state, {
        page: action.page,
        visibleRows: state.visibleList.slice(current, current + ROWS_PER_PAGE)
      });
    }
    case SHOW_CONSOLIDATED_MODAL: {
      return _.set('consolidatedModal', action.visible, state);
    }
    case HIDE_30_DAY_NOTICE: {
      return _.set('show30DayNotice', false, state);
    }
    default:
      return state;
  }
}
