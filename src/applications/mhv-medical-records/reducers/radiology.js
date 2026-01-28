import { parseISO } from 'date-fns';
import { Actions } from '../util/actionTypes';
import { buildInitialDateRange } from '../util/helpers';
import { loadStates, DEFAULT_DATE_RANGE } from '../util/constants';
import {
  convertMhvRadiologyRecord,
  convertCvixRadiologyRecord,
  mergeRadiologyLists,
  mergeRadiologyDetails,
} from '../util/imagesUtil';

const initialState = {
  /**
   * The last time that the list was fetched and known to be up-to-date
   * @type {Date}
   */
  listCurrentAsOf: undefined,
  /**
   * PRE_FETCH, FETCHING, FETCHED
   */
  listState: loadStates.PRE_FETCH,

  /**
   * The list of radiology records returned from the api
   * @type {Array}
   */
  radiologyList: undefined,
  /**
   * New list of records retrieved. This list is NOT displayed. It must manually be copied into the display list.
   * @type {Array}
   */
  updatedList: undefined,
  /**
   * The radiology record currently being displayed to the user
   */
  radiologyDetails: undefined,
  /**
   * The selected date range for displaying radiology records
   * */
  dateRange: buildInitialDateRange(DEFAULT_DATE_RANGE),
};

function sortByDate(array) {
  return array.sort((a, b) => {
    const dateA = parseISO(a.sortDate);
    const dateB = parseISO(b.sortDate);
    if (!a.sortDate) return 1; // Push nulls to the end
    if (!b.sortDate) return -1; // Keep non-nulls at the front
    return dateB - dateA;
  });
}

export const radiologyReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Radiology.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    case Actions.Radiology.GET_LIST: {
      const oldList = state.radiologyList;
      const radiologyTestsList = (action.radiologyResponse || [])
        .filter(Boolean)
        .map(convertMhvRadiologyRecord)
        .filter(Boolean);
      const cvixRadiologyTestsList = (action.cvixRadiologyResponse || [])
        .filter(Boolean)
        .map(convertCvixRadiologyRecord)
        .filter(Boolean);
      const mergedList = mergeRadiologyLists(
        radiologyTestsList,
        cvixRadiologyTestsList,
      );
      const newList = sortByDate(mergedList);

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        radiologyList: typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
      };
    }
    case Actions.Radiology.GET: {
      return {
        ...state,
        radiologyDetails: mergeRadiologyDetails(
          action.response.phrDetails,
          action.response.cvixDetails,
        ),
      };
    }
    case Actions.Radiology.GET_FROM_LIST: {
      return {
        ...state,
        radiologyDetails: action.response,
      };
    }
    case Actions.Radiology.CLEAR_DETAIL: {
      return {
        ...state,
        radiologyDetails: undefined,
      };
    }
    case Actions.Radiology.COPY_UPDATED_LIST: {
      const originalList = state.radiologyList;
      const { updatedList } = state;
      if (
        Array.isArray(originalList) &&
        Array.isArray(updatedList) &&
        originalList.length !== updatedList.length
      ) {
        return {
          ...state,
          radiologyList: state.updatedList,
          updatedList: undefined,
        };
      }
      return {
        ...state,
      };
    }
    case Actions.Radiology.SET_DATE_RANGE: {
      return {
        ...state,
        dateRange: action.payload,
      };
    }
    default:
      return state;
  }
};
