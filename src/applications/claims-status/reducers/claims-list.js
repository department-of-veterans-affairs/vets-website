import orderBy from 'lodash/orderBy';
import set from 'platform/utilities/data/set';
import moment from 'moment';
import { appealTypes } from '../utils/appeals-v2-helpers';

import {
  SORT_CLAIMS,
  HIDE_30_DAY_NOTICE,
  FETCH_APPEALS_SUCCESS,
  SET_CLAIMS_UNAVAILABLE,
} from '../actions';
import { getClaimType } from '../utils/helpers';

const ROWS_PER_PAGE = 10;

const initialState = {
  claims: [],
  appeals: [],
  visibleList: [],
  visibleRows: [],
  page: 1,
  pages: 1,
  sortProperty: 'phaseChangeDate',
  consolidatedModal: false,
  show30DayNotice: true,
  claimsLoading: false,
  appealsLoading: false,
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
  return claim.attributes ? getClaimType(claim).toLowerCase() : '';
}

const sortPropertyFn = {
  phaseChangeDate,
  dateFiled,
  claimType,
};

function sortList(list, sortProperty) {
  const sortOrder = sortProperty === 'claimType' ? 'asc' : 'desc';
  const sortFunc = el => {
    if (appealTypes.includes(el.type)) {
      const events = orderBy(
        el.attributes.events,
        [e => moment(e.date).unix()],
        'desc',
      );
      const lastEvent = events[0];
      const firstEvent = events[events.length - 1];

      switch (sortProperty) {
        case 'phaseChangeDate':
          return moment(lastEvent.date).unix();
        case 'dateFiled':
          return moment(firstEvent.date).unix();
        default:
          break;
      }
    }
    return sortPropertyFn[sortProperty] && sortPropertyFn[sortProperty](el);
  };

  return orderBy(list, [sortFunc, 'id'], sortOrder);
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
    // Fall-through until we handle v2 appeals solely in the appeals reducer
    case FETCH_APPEALS_SUCCESS:
    case SORT_CLAIMS: {
      const visibleList = sortList(state.visibleList, action.sortProperty);
      return {
        ...state,
        sortProperty: action.sortProperty,
        visibleList,
        visibleRows: getVisibleRows(visibleList, 1),
        page: 1,
        pages: getTotalPages(visibleList),
      };
    }
    case HIDE_30_DAY_NOTICE: {
      return set('show30DayNotice', false, state);
    }
    case SET_CLAIMS_UNAVAILABLE:
      return set('claimsLoading', false, state);
    default:
      return state;
  }
}
