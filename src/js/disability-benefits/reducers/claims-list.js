import _ from 'lodash/fp';

import { SET_CLAIMS, FILTER_CLAIMS, CHANGE_CLAIMS_PAGE, SHOW_CONSOLIDATED_MODAL, HIDE_30_DAY_NOTICE } from '../actions';

const ROWS_PER_PAGE = 10;

const initialState = {
  list: null,
  visibleRows: [],
  page: 1,
  pages: 1,
  consolidatedModal: false,
  show30DayNotice: true
};

// We want to sort claims without dates below claims with dates
function phaseChangeDate(claim) {
  return claim.attributes && claim.attributes.phaseChangeDate
    ? claim.attributes.phaseChangeDate
    : '0';
}

export default function claimsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIMS: {
      return _.assign(state, {
        list: action.claims
      });
    }
    case FILTER_CLAIMS: {
      let sortedList = _.orderBy([phaseChangeDate, 'id'], 'desc', state.list);
      const current = (state.page - 1) * ROWS_PER_PAGE;
      if (action.filter) {
        const open = action.filter === 'open';
        sortedList = sortedList.filter((claim) => {
          return claim.attributes.open === open;
        });
      }
      return _.assign(state, {
        visibleList: sortedList,
        visibleRows: sortedList.slice(current, current + ROWS_PER_PAGE),
        pages: Math.ceil(sortedList.length / ROWS_PER_PAGE)
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
