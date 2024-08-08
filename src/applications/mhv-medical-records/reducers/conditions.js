import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD, loadStates } from '../util/constants';
import { isArrayAndHasItems, extractContainedResource } from '../util/helpers';

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
    const ref = condition.recorder.extension[0].valueReference?.reference;
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
    if (org?.name) {
      return org.name[0].text;
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

export const conditionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Conditions.GET: {
      return {
        ...state,
        conditionDetails: convertCondition(action.response),
      };
    }
    case Actions.Conditions.GET_FROM_LIST: {
      return {
        ...state,
        conditionDetails: action.response,
      };
    }
    case Actions.Conditions.GET_LIST: {
      const oldList = state.conditionsList;
      const newList =
        action.response.entry
          ?.map(record => {
            const condition = record.resource;
            return convertCondition(condition);
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];
      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        conditionsList: typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
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
