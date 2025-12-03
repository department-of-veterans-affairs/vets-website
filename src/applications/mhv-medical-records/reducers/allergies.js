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
    const ref = allergy.recorder.extension[0]?.valueReference?.reference;
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
        allergy.category
          .join(', ')
          .replace(/^./, char => char.toUpperCase())) ||
      EMPTY_FIELD,
    name: allergy?.code?.text || EMPTY_FIELD,
    date: allergy?.recordedDate
      ? formatDateLong(allergy.recordedDate)
      : EMPTY_FIELD,
    reaction: getReactions(allergy),
    location: extractLocation(allergy),
    observedOrReported: extractObservedReported(allergy),
    notes:
      (isArrayAndHasItems(allergy.note) && allergy.note[0]?.text) ||
      EMPTY_FIELD,
    provider: allergy.recorder?.display || EMPTY_FIELD,
  };
};

export const convertUnifiedAllergy = allergy => {
  const allergyData = allergy?.attributes || allergy;

  return {
    id: allergy.id,
    type:
      (isArrayAndHasItems(allergyData.categories) &&
        allergyData.categories
          .join(', ')
          .replace(/^./, char => char.toUpperCase())) ||
      EMPTY_FIELD,
    name: allergyData?.name || EMPTY_FIELD,
    date: allergyData?.date ? formatDateLong(allergyData.date) : EMPTY_FIELD,
    reaction: allergyData?.reactions || EMPTY_FIELD,
    location: allergyData?.location || EMPTY_FIELD,
    observedOrReported: (() => {
      if (allergyData?.observedHistoric) {
        return allergyData.observedHistoric === 'o'
          ? allergyTypes.OBSERVED
          : allergyTypes.REPORTED;
      }
      return EMPTY_FIELD;
    })(),
    notes:
      (isArrayAndHasItems(allergyData.notes) && allergyData.notes.join(' ')) ||
      EMPTY_FIELD,
    provider: allergyData?.provider || EMPTY_FIELD,
    sortKey: allergyData?.date ? new Date(allergyData.date) : null,
    // Note: The v2 unified endpoint combines both Oracle Health and VistA data sources
    // into a single normalized format. The backend does not provide a data source field
    // to distinguish between them. We set isOracleHealthData to true for all v2 records
    // because the unified format uses the same display logic as Oracle Health data
    // (with provider, location, and other OH-style fields). Components check this flag
    // to determine which template to use for rendering.
    isOracleHealthData: true,
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
