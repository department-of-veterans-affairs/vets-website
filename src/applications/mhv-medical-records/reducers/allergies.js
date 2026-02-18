import {
  convertAllergy as sharedConvertAllergy,
  convertUnifiedAllergy as sharedConvertUnifiedAllergy,
} from '@department-of-veterans-affairs/mhv/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD, loadStates } from '../util/constants';

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
   * Whether the current list was populated via a GET_UNIFIED_LIST action.
   * When true, incoming GET_LIST dispatches (e.g. from Blue Button) will
   * NOT overwrite updatedList, preventing V1 data from contaminating the
   * accelerated V2 list.
   * @type {boolean}
   */
  listIsUnified: false,

  /**
   * The list of allergies returned from the api
   * @type {Array}
   */
  allergiesList: undefined,
  /**
   * New list of records retrieved. This list is NOT displayed. It must manually be copied into the display list.
   * @type {Array}
   */
  updatedList: undefined,
  /**
   * The condition currently being displayed to the user
   */
  allergyDetails: undefined,
};

// Options for Medical Records app (uses defaults)
const allergyOptions = {
  emptyField: EMPTY_FIELD,
};

/**
 * Convert a FHIR AllergyIntolerance resource using shared converter.
 * Wrapper that passes Medical Records options.
 */
export const convertAllergy = allergy => {
  return sharedConvertAllergy(allergy, allergyOptions);
};

/**
 * Convert a unified API allergy response using shared converter.
 * Wrapper that passes Medical Records options.
 */
export const convertUnifiedAllergy = allergy => {
  return sharedConvertUnifiedAllergy(allergy, allergyOptions);
};

export const allergyReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Allergies.GET: {
      return {
        ...state,
        allergyDetails: convertAllergy(action.response),
      };
    }
    case Actions.Allergies.GET_FROM_LIST: {
      return {
        ...state,
        allergyDetails: action.response,
      };
    }
    case Actions.Allergies.GET_LIST: {
      // If the list was populated via GET_UNIFIED_LIST, don't let a V1 GET_LIST
      // (e.g. from Blue Button) overwrite the data via updatedList.
      if (state.listIsUnified) {
        return {
          ...state,
          listState: loadStates.FETCHED,
        };
      }

      const oldList = state.allergiesList;
      const newList =
        action?.response?.entry
          ?.map(allergy => {
            return convertAllergy(allergy.resource);
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        allergiesList: typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
      };
    }
    case Actions.Allergies.COPY_UPDATED_LIST: {
      const originalList = state.allergiesList;
      const { updatedList } = state;
      if (
        Array.isArray(originalList) &&
        Array.isArray(updatedList) &&
        originalList.length !== updatedList.length
      ) {
        return {
          ...state,
          allergiesList: state.updatedList,
          updatedList: undefined,
        };
      }
      return {
        ...state,
      };
    }
    case Actions.Allergies.CLEAR_DETAIL: {
      return {
        ...state,
        allergyDetails: undefined,
      };
    }
    case Actions.Allergies.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    case Actions.Allergies.GET_UNIFIED_LIST: {
      const data = action.response.data || [];
      const newList =
        data
          ?.map(allergy => {
            return convertUnifiedAllergy(allergy);
          })
          .sort((a, b) => {
            if (!a.sortKey) return 1; // Push nulls to the end
            if (!b.sortKey) return -1; // Keep non-nulls at the front
            return b.sortKey.getTime() - a.sortKey.getTime();
          }) || [];
      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        allergiesList: newList,
        listIsUnified: true,
      };
    }
    case Actions.Allergies.GET_UNIFIED_ITEM: {
      return {
        ...state,
        allergyDetails: convertUnifiedAllergy(action.response.data),
      };
    }
    default:
      return state;
  }
};
