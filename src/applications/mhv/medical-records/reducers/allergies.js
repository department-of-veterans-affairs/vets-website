import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD, allergyTypes } from '../util/constants';
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

const interpretObservedOrReported = code => {
  if (code === 'confirmed') return allergyTypes.OBSERVED;
  if (code === 'unconfirmed') return allergyTypes.REPORTED;
  return EMPTY_FIELD;
};

export const convertAllergy = allergy => {
  return {
    id: allergy.id,
    type:
      (isArrayAndHasItems(allergy.category) && allergy.category[0]) ||
      EMPTY_FIELD,
    name: allergy?.code?.text || EMPTY_FIELD,
    date: formatDateLong(allergy.onsetDateTime),
    reaction: getReactions(allergy),
    location: allergy.recorder?.display || EMPTY_FIELD,
    observedOrReported:
      isArrayAndHasItems(allergy.verificationStatus?.coding) &&
      interpretObservedOrReported(allergy.verificationStatus.coding[0].code),
    notes:
      (isArrayAndHasItems(allergy.note) && allergy.note[0].text) || EMPTY_FIELD,
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
