import {
  environment,
  formatDateLong,
} from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { getNames, getReactions } from '../util/helpers';
import { testing } from '../util/constants';

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
    date: formatDateLong(allergy.meta?.lastUpdated),
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
          environment.BUILDTYPE === 'localhost' && testing
            ? convertAllergy(action.response)
            : action.response,
      };
    }
    case Actions.Allergies.GET_LIST: {
      return {
        ...state,
        allergiesList:
          environment.BUILDTYPE === 'localhost' && testing
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
