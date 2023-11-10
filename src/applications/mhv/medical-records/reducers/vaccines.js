import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD } from '../util/constants';
import { isArrayAndHasItems } from '../util/helpers';

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
    location: vaccine.location?.display || EMPTY_FIELD,
    manufacturer: vaccine.manufacturer || EMPTY_FIELD,
    reactions: vaccine.reaction?.map(item => item.detail?.display) || [],
    notes:
      (isArrayAndHasItems(vaccine.note) &&
        vaccine.note.map(note => note.text)) ||
      [],
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
