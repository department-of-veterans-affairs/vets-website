import { Actions } from '../util/actionTypes';

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
    date: vaccine.occurrenceDateTime,
    // type: ?
    // dosage: ?
    // facility: Possibly needs a separate call to Encounter,
    // reactions: Possibly needs separate calls to Observation,
    comments: vaccine.note?.text,
  };
};

export const vaccineReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Vaccines.GET: {
      // The server returns a bundle which includes ancillary data. Filter to
      // isolate the vaccine. There will only ever be one.
      const vaccine = action.response?.entry
        ? action.response.entry.filter(
            entry => entry.resource.resourceType === 'Immunization',
          )[0].resource
        : null;
      // const vaccine = action.response;
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
