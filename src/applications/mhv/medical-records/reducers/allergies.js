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
  if (code === 'o') return allergyTypes.OBSERVED;
  if (code === 'h') return allergyTypes.REPORTED;
  return EMPTY_FIELD;
};

export const convertAllergy = allergy => {
  return {
    id: allergy.id,
    type:
      (isArrayAndHasItems(allergy.category) &&
        allergy.category[0].charAt(0).toUpperCase() +
          allergy.category[0].slice(1)) ||
      EMPTY_FIELD,
    name: allergy?.code?.text || EMPTY_FIELD,
    date: formatDateLong(allergy.recordedDate),
    reaction: getReactions(allergy),
    location: allergy.recorder?.display || EMPTY_FIELD,
    observedOrReported:
      isArrayAndHasItems(allergy.extension) &&
      interpretObservedOrReported(
        allergy.extension.filter(item =>
          item.url.includes('allergyObservedHistoric'),
        )[0].valueString,
      ),
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
    case Actions.Allergies.CLEAR_DETAIL: {
      return {
        ...state,
        allergyDetails: undefined,
      };
    }
    default:
      return state;
  }
};
