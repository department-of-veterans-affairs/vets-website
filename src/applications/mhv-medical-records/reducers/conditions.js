import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD, loadStates } from '../util/constants';
import {
  isArrayAndHasItems,
  extractContainedResource,
  formatNameFirstToLast,
  formatDateTime,
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
   * Whether the current list was populated via a GET_UNIFIED_LIST action.
   * When true, incoming GET_LIST dispatches (e.g. from Blue Button) will
   * NOT overwrite updatedList, preventing V1 data from contaminating the
   * accelerated V2 list.
   * @type {boolean}
   */
  listIsUnified: false,

  /**
   * The list of conditions returned from the api
   * @type {Array}
   */
  conditionsList: undefined,
  /**
   * New list of records retrieved. This list is NOT displayed. It must manually be copied into the display list.
   * @type {Array}
   */
  updatedList: undefined,
  /**
   * The condition currently being displayed to the user
   */
  conditionDetails: undefined,
};

/**
 * Extracts the location name from a condition object.
 *
 * @param {object} condition - The condition object containing location information.
 * @returns {string} - The location name or an empty field if not found.
 */
export const extractLocation = condition => {
  if (isArrayAndHasItems(condition?.recorder?.extension)) {
    const ref = condition.recorder.extension[0]?.valueReference?.reference;
    // Use the reference inside "recorder" to get the value from "contained".
    const org = extractContainedResource(condition, ref);
    if (org?.name) {
      return org.name;
    }
  }
  return EMPTY_FIELD;
};

/**
 * Extracts the observation code text from a condition object.
 *
 * @param {object} condition - The condition object containing observation information.
 * @returns {string} - The observation code text or an empty field if not found.
 */
export const extractProvider = condition => {
  if (condition?.recorder) {
    const ref = condition.recorder?.reference;
    // Use the reference inside "recorder" to get the value from "contained".
    const org = extractContainedResource(condition, ref);
    if (isArrayAndHasItems(org?.name)) {
      return formatNameFirstToLast(org.name[0]);
    }
  }
  return EMPTY_FIELD;
};

/**
 * Extracts the note text from a condition object.
 *
 * @param {object} condition - The condition object containing note information.
 * @returns {string} - The note text or an empty field if not found.
 */
export const extractProviderNote = condition => {
  // Check if condition is defined and has the 'note' property
  if (condition && isArrayAndHasItems(condition.note)) {
    return condition.note.map(note => note.text);
  }
  return EMPTY_FIELD;
};

export const convertCondition = condition => {
  return {
    id: condition?.id,
    date: condition?.recordedDate
      ? formatDateLong(condition.recordedDate)
      : EMPTY_FIELD,
    name: condition?.code?.text || EMPTY_FIELD,
    provider: extractProvider(condition),
    facility: extractLocation(condition),
    comments: extractProviderNote(condition),
  };
};

export const convertNewCondition = condition => {
  if (condition) {
    return {
      id: condition.id,
      name: condition.name || EMPTY_FIELD,
      date: condition.date ? formatDateLong(condition.date) : EMPTY_FIELD,
      provider: condition.provider || EMPTY_FIELD,
      facility: condition.facility || EMPTY_FIELD,
      comments: isArrayAndHasItems(condition.comments)
        ? condition.comments
        : EMPTY_FIELD,
    };
  }
  return null;
};

export const convertUnifiedCondition = condition => {
  const formatConditionDate = formatDateTime(condition?.attributes?.date);
  const conditionDate = formatConditionDate
    ? formatConditionDate.formattedDate
    : '';
  // Ensure a finite timestamp
  const ts = new Date(condition?.attributes?.date).getTime();

  return {
    id: condition?.id,
    name: condition?.attributes?.name || EMPTY_FIELD,
    date: conditionDate || EMPTY_FIELD,
    sortKey: Number.isFinite(ts) ? ts : null,
    provider: condition?.attributes?.provider || EMPTY_FIELD,
    facility: condition?.attributes?.facility || EMPTY_FIELD,
    comments: isArrayAndHasItems(condition?.attributes?.comments)
      ? condition.attributes?.comments
      : EMPTY_FIELD,
  };
};

export const conditionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Conditions.GET: {
      const condition = action.response;

      let conditionDetails = null;
      if (condition) {
        conditionDetails = condition.resourceType
          ? convertCondition(condition)
          : convertNewCondition(condition.data?.attributes);
      }

      return {
        ...state,
        conditionDetails,
      };
    }
    case Actions.Conditions.GET_FROM_LIST: {
      return {
        ...state,
        conditionDetails: action.response,
      };
    }
    case Actions.Conditions.GET_LIST: {
      // If the list was populated via GET_UNIFIED_LIST, don't let a V1 GET_LIST
      // (e.g. from Blue Button) overwrite the data via updatedList.
      if (state.listIsUnified) {
        return {
          ...state,
          listState: loadStates.FETCHED,
        };
      }

      const oldList = state.conditionsList;
      let newList;
      if (action.response.resourceType) {
        // Harden: ensure entry is an array before map/sort to avoid undefined.sort TypeErrors
        const fhirEntry = Array.isArray(action.response?.entry)
          ? action.response.entry
          : [];
        newList = fhirEntry
          .map(record => convertCondition(record.resource))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        // Ensure we always produce an array for non-FHIR responses
        newList = (action.response?.data || []).map(record =>
          convertNewCondition(record.attributes),
        );
      }
      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        conditionsList: typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
      };
    }
    case Actions.Conditions.GET_UNIFIED_ITEM: {
      return {
        ...state,
        conditionDetails: convertUnifiedCondition(action.response.data),
      };
    }
    case Actions.Conditions.GET_UNIFIED_LIST: {
      const data = action.response?.data || [];
      const newList =
        data
          .map(condition => {
            return convertUnifiedCondition(condition);
          })
          .sort((a, b) => {
            const ak = Number.isFinite(a.sortKey) ? a.sortKey : -Infinity;
            const bk = Number.isFinite(b.sortKey) ? b.sortKey : -Infinity;
            return bk - ak; // desc, missing/invalid last
          }) || [];
      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        conditionsList: newList,
        listIsUnified: true,
      };
    }
    case Actions.Conditions.COPY_UPDATED_LIST: {
      const originalList = state.conditionsList;
      const { updatedList } = state;
      if (
        Array.isArray(originalList) &&
        Array.isArray(updatedList) &&
        originalList.length !== updatedList.length
      ) {
        return {
          ...state,
          conditionsList: state.updatedList,
          updatedList: undefined,
        };
      }
      return {
        ...state,
      };
    }
    case Actions.Conditions.CLEAR_DETAIL: {
      return {
        ...state,
        conditionDetails: undefined,
      };
    }
    case Actions.Conditions.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    default:
      return state;
  }
};
