import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { emptyField } from '../util/constants';

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
const convertVaccine = vaccine => {
  if (typeof vaccine === 'undefined' || vaccine === null) {
    return null;
  }
  return {
    id: vaccine.id,
    name: vaccine.vaccineCode?.text,
    date: formatDateLong(vaccine.occurrenceDateTime) || emptyField,
    location: vaccine.location?.display || emptyField,
    manufacturer: vaccine.manufacturer || emptyField,
    reactions: vaccine.reaction || [],
    notes: vaccine.note?.map(note => note.text) || [],
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
        vaccinesList: vaccineList.map(record => {
          const vaccine = record.resource;
          return convertVaccine(vaccine);
        }),
      };
    }
    default:
      return state;
  }
};
