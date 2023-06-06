import environment from 'platform/utilities/environment';
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
        allergyDetails:
          environment.BUILDTYPE === 'localhost'
            ? convertAllergy(action.response)
            : action.response,
      };
    }
    case Actions.Allergies.GET_LIST: {
      return {
        ...state,
        allergiesList:
          environment.BUILDTYPE === 'localhost'
            ? action.response.entry.map(allergy => {
                return convertAllergy(allergy.resource);
              })
            : action.response.map(allergy => {
                return { ...allergy };
              }),
      };
    }
    default:
      return state;
  }
};
