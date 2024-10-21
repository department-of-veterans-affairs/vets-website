import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD, allergyTypes, loadStates } from '../util/constants';
import {
  getReactions,
  isArrayAndHasItems,
  extractContainedResource,
} from '../util/helpers';

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

export const extractLocation = allergy => {
  if (isArrayAndHasItems(allergy?.recorder?.extension)) {
    const ref = allergy.recorder.extension[0].valueReference?.reference;
    // Use the reference inside "recorder" to get the value from "contained".
    const org = extractContainedResource(allergy, ref);
    if (org?.name) {
      return org.name;
    }
  }
  return EMPTY_FIELD;
};

export const extractObservedReported = allergy => {
  if (allergy && isArrayAndHasItems(allergy.extension)) {
    const extItem = allergy.extension.find(
      item => item.url && item.url.includes('allergyObservedHistoric'),
    );
    if (extItem?.valueCode) {
      if (extItem.valueCode === 'o') return allergyTypes.OBSERVED;
      if (extItem.valueCode === 'h') return allergyTypes.REPORTED;
    }
  }
  return EMPTY_FIELD;
};

export const convertAllergy = allergy => {
  return {
    id: allergy.id,
    type:
      (isArrayAndHasItems(allergy.category) &&
        allergy.category[0].charAt(0).toUpperCase() +
          allergy.category[0].slice(1)) ||
      EMPTY_FIELD,
    name: allergy?.code?.text || EMPTY_FIELD,
    date: allergy?.recordedDate
      ? formatDateLong(allergy.recordedDate)
      : EMPTY_FIELD,
    reaction: getReactions(allergy),
    location: extractLocation(allergy),
    observedOrReported: extractObservedReported(allergy),
    notes:
      (isArrayAndHasItems(allergy.note) && allergy.note[0].text) || EMPTY_FIELD,
  };
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
      const oldList = state.allergiesList;
      const newList =
        action.response.entry
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
    default:
      return state;
  }
};
