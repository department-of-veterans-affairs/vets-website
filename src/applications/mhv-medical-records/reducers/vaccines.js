import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD, loadStates } from '../util/constants';
import {
  isArrayAndHasItems,
  extractContainedResource,
  formatDate,
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
   * The list of vaccines returned from the api
   * @type {Array}
   */
  vaccinesList: undefined,

  /** Information about list pagination, sorting, filtering, etc. */
  listMetadata: undefined,

  updateNeeded: false,

  /**
   * New list of records retrieved. This list is NOT displayed. It must manually be copied into the display list.
   * @type {Array}
   */
  updatedList: undefined,
  /**
   * The vaccine currently being displayed to the user
   */
  vaccineDetails: undefined,
};

/**
 * Extracts the location name from a vaccine object.
 *
 * @param {object} vaccine - The vaccine object containing location information.
 * @returns {string} - The location name or an empty field if not found.
 */
export const extractLocation = vaccine => {
  // Check if the vaccine object contains valid location and contained resource data
  if (
    vaccine.location &&
    vaccine.location.reference &&
    vaccine.contained &&
    isArrayAndHasItems(vaccine.contained)
  ) {
    // Extract the reference ID from the location field
    const refId = vaccine.location.reference;
    const location = extractContainedResource(vaccine, refId);
    return location?.name || EMPTY_FIELD;
  }
  return EMPTY_FIELD;
};

/**
 * Extracts the observation code text from a vaccine object.
 *
 * @param {object} vaccine - The vaccine object containing observation information.
 * @returns {string} - The observation code text or an empty field if not found.
 */
export const extractReaction = vaccine => {
  if (isArrayAndHasItems(vaccine.contained)) {
    const observation = vaccine.contained.find(
      item => item.resourceType === 'Observation',
    );
    // Check if the observation object and its code.text property exist
    if (observation && observation.code && observation.code.text) {
      // Extract and log the observation code text
      const reactions = observation.code.text;

      return reactions || EMPTY_FIELD;
    }
  }
  return EMPTY_FIELD;
};

/**
 * Extracts the note text from a vaccine object.
 *
 * @param {object} vaccine - The vaccine object containing note information.
 * @returns {string} - The note text or an empty field if not found.
 */
export const extractNote = vaccine => {
  // Check if the vaccine object contains valid note data
  return (
    (isArrayAndHasItems(vaccine.note) &&
      vaccine.note.map(note => note.text).join().length &&
      vaccine.note.map(note => note.text)) ||
    []
  );
};

/**
 * Convert the FHIR vaccine resource from the backend into the appropriate model.
 * @param {Object} vaccine a FHIR vaccine resource
 * @returns a vaccine object that this application can use, or null if the param is null/undefined
 */

export const convertVaccine = vaccine => {
  if (typeof vaccine === 'undefined' || vaccine === null) {
    return null;
  }
  return {
    id: vaccine.id,
    name: vaccine.vaccineCode?.text,
    date: vaccine.occurrenceDateTime
      ? formatDate(vaccine.occurrenceDateTime)
      : EMPTY_FIELD,
    location: extractLocation(vaccine),
    manufacturer: vaccine.manufacturer || EMPTY_FIELD,
    reactions: extractReaction(vaccine),
    notes: extractNote(vaccine),
  };
};

export const convertNewVaccine = vaccine => {
  if (vaccine) {
    return {
      ...vaccine,
      date: vaccine.dateReceived
        ? formatDate(vaccine.dateReceived)
        : EMPTY_FIELD,
      location: vaccine.location || EMPTY_FIELD,
      manufacturer: vaccine.manufacturer || EMPTY_FIELD,
      reactions: vaccine.reactions || EMPTY_FIELD,
    };
  }
  return null;
};

export const convertUnifiedVaccine = record => {
  if (!record) {
    return null;
  }
  return {
    id: record.id,
    name: record.attributes?.groupName || EMPTY_FIELD,
    date: formatDate(record.attributes?.date),
    location: record.attributes?.location || EMPTY_FIELD,
    shortDescription: record.attributes?.shortDescription || EMPTY_FIELD,
    manufacturer: record.attributes?.manufacturer || EMPTY_FIELD,
    reaction: record.attributes?.reaction || EMPTY_FIELD,
    note: record.attributes?.note || EMPTY_FIELD,
    doseNumber: record.attributes?.doseNumber,
    seriesDoses: record.attributes?.seriesDoses,
    doseDisplay:
      record.attributes?.doseNumber && record.attributes?.seriesDoses
        ? `${record.attributes.doseNumber} of ${record.attributes.seriesDoses}`
        : EMPTY_FIELD,
  };
};

export const vaccineReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vaccines.GET: {
      const vaccine = action.response;

      let vaccineDetails = null;
      if (vaccine) {
        vaccineDetails = vaccine.resourceType
          ? convertVaccine(vaccine)
          : convertNewVaccine(vaccine.data?.attributes);
      }

      return {
        ...state,
        vaccineDetails,
      };
    }
    case Actions.Vaccines.GET_FROM_LIST: {
      return {
        ...state,
        vaccineDetails: action.response,
      };
    }
    case Actions.Vaccines.GET_UNIFIED_VACCINE: {
      const vaccine = action.response.data;
      // Convert the unified vaccine to the
      return {
        ...state,
        vaccineDetails: convertUnifiedVaccine(vaccine),
      };
    }
    case Actions.Vaccines.GET_UNIFIED_LIST: {
      const oldList = state.vaccinesList;
      const metadata = action.response.meta;
      const newList =
        action.response.data
          ?.map(convertUnifiedVaccine)
          .filter(record => record !== null)
          .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

      const vaccinesList = typeof oldList === 'undefined' ? newList : oldList;
      const updatedList = typeof oldList !== 'undefined' ? newList : undefined;

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        vaccinesList,
        updatedList,
        listMetadata: metadata,
        updateNeeded: false,
      };
    }
    case Actions.Vaccines.GET_LIST: {
      const { useBackendPagination } = action;
      const oldList = state.vaccinesList;
      let newList;
      let metadata;
      if (action.response.resourceType) {
        newList =
          action.response.entry
            ?.map(record => {
              const vaccine = record.resource;
              return convertVaccine(vaccine);
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];
      } else {
        newList = action.response.data?.map(record =>
          convertNewVaccine(record.attributes),
        );
        metadata = action.response.meta;
      }

      let vaccinesList = typeof oldList === 'undefined' ? newList : oldList;
      let updatedList = typeof oldList !== 'undefined' ? newList : undefined;
      if (useBackendPagination) {
        vaccinesList = newList;
        updatedList = undefined;
      }

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        vaccinesList,
        updatedList,
        listMetadata: metadata,
        updateNeeded: false,
      };
    }
    case Actions.Vaccines.CHECK_FOR_UPDATE: {
      const metadata = action.response.meta;
      return {
        ...state,
        updateNeeded:
          metadata?.pagination?.totalEntries &&
          metadata?.pagination?.totalEntries !==
            state.listMetadata?.pagination?.totalEntries,
      };
    }
    case Actions.Vaccines.COPY_UPDATED_LIST: {
      const originalList = state.vaccinesList;
      const { updatedList } = state;
      if (
        Array.isArray(originalList) &&
        Array.isArray(updatedList) &&
        originalList.length !== updatedList.length
      ) {
        return {
          ...state,
          vaccinesList: state.updatedList,
          updatedList: undefined,
        };
      }
      return {
        ...state,
      };
    }
    case Actions.Vaccines.CLEAR_DETAIL: {
      return {
        ...state,
        vaccineDetails: undefined,
      };
    }
    case Actions.Vaccines.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    default:
      return state;
  }
};
