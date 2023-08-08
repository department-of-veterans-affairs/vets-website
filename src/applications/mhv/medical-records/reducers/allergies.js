import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { emptyField } from '../util/constants';
import { getReactions, isArrayAndHasItems } from '../util/helpers';

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

export const convertAllergy = allergy => {
  return {
    id: allergy.id,
    type:
      (isArrayAndHasItems(allergy.category) && allergy.category[0]) ||
      emptyField,
    name: allergy?.code?.text || emptyField,
    date: formatDateLong(allergy.onsetDateTime),
    reaction: getReactions(allergy),
    drugClass: allergy.drugClass || emptyField,
    location:
      (isArrayAndHasItems(allergy.context?.related) &&
        allergy.context.related[0].text) ||
      emptyField,
    observed: allergy.observed || emptyField,
    notes:
      (isArrayAndHasItems(allergy.note) && allergy.note[0].text) || emptyField,
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
        allergiesList:
          action.response.entry?.map(allergy => {
            return convertAllergy(allergy.resource);
          }) || [],
      };
    }
    default:
      return state;
  }
};
