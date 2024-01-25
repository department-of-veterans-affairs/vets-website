import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD } from '../util/constants';
import { isArrayAndHasItems, extractContainedResource } from '../util/helpers';

const initialState = {
  /**
   * The list of vaccines returned from the api
   * @type {array}
   */
  vaccinesList: undefined,
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
    (isArrayAndHasItems(vaccine.note) && vaccine.note.map(note => note.text)) ||
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
      ? formatDateLong(vaccine.occurrenceDateTime)
      : EMPTY_FIELD,
    location: extractLocation(vaccine),
    manufacturer: vaccine.manufacturer || EMPTY_FIELD,
    reactions: extractReaction(vaccine),
    notes: extractNote(vaccine),
  };
};

export const vaccineReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vaccines.GET: {
      const vaccine = action.response;
      return {
        ...state,
        vaccineDetails: convertVaccine(vaccine),
      };
    }
    case Actions.Vaccines.GET_FROM_LIST: {
      return {
        ...state,
        vaccineDetails: action.response,
      };
    }
    case Actions.Vaccines.GET_LIST: {
      const vaccineList = action.response.entry;
      return {
        ...state,
        vaccinesList:
          vaccineList
            ?.map(record => {
              const vaccine = record.resource;
              return convertVaccine(vaccine);
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date)) || [],
      };
    }
    case Actions.Vaccines.CLEAR_DETAIL: {
      return {
        ...state,
        vaccineDetails: undefined,
      };
    }
    default:
      return state;
  }
};
