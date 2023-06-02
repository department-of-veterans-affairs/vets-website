import { Actions } from '../util/actionTypes';
import { dateFormat, getNames, getReactions } from '../util/helpers';

const initialState = {
  /**
   * The list of conditions returned from the api
   * @type {array}
   */
  allergiesList: undefined,
  /**
   * The condition currently being displayed to the user
   */
  allergyDetails: undefined,
};

const convertAllergy = allergy => {
  return {
    id: allergy.id,
    type: allergy.type,
    name: getNames(allergy),
    reaction: getReactions(allergy),
    date: dateFormat(allergy.meta?.lastUpdated, 'MMMM D, YYYY'),
    // drugClass: allergy.drugClass,
    // location: allergy.location,
    // observed: allergy.observed,
    // notes: allergy.notes,
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
    case Actions.Allergies.GET_LIST: {
      return {
        ...state,
        allergiesList: action.response.entry.map(allergy => {
          return convertAllergy(allergy.resource);
        }),
      };
    }
    default:
      return state;
  }
};
