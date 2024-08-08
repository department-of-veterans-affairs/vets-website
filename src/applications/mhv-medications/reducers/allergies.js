// TODO: consider re-using medical-records reducer
/* eslint-disable sonarjs/no-small-switch */
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import {
  extractContainedResource,
  getReactions,
  isArrayAndHasItems,
} from '../util/helpers';
import { allergyTypes, EMPTY_FIELD } from '../util/constants';

const initialState = {
  /**
   * The list of allergies returned from the api
   * @type {array}
   */
  allergiesList: undefined,
  /**
   * Error flag
   * @type {boolean}
   */
  error: undefined,
};

export const extractLocation = allergy => {
  if (isArrayAndHasItems(allergy?.recorder?.extension)) {
    const ref = allergy.recorder.extension[0].valueReference?.reference;
    // Use the reference inside "recorder" to get the value from "contained".
    const org = extractContainedResource(allergy, ref);
    if (org?.name) {
      return org.name;
    }
  }
  return EMPTY_FIELD;
};

export const extractObservedReported = allergy => {
  if (allergy && isArrayAndHasItems(allergy.extension)) {
    const extItem = allergy.extension.find(
      item => item.url && item.url.includes('allergyObservedHistoric'),
    );
    if (extItem?.valueCode) {
      if (extItem.valueCode === 'o') return allergyTypes.OBSERVED;
      if (extItem.valueCode === 'h') return allergyTypes.REPORTED;
    }
  }
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
    date: allergy?.recordedDate
      ? formatDateLong(allergy.recordedDate)
      : EMPTY_FIELD,
    reaction: getReactions(allergy),
    location: extractLocation(allergy),
    observedOrReported: extractObservedReported(allergy),
    notes:
      (isArrayAndHasItems(allergy.note) && allergy.note[0].text) || EMPTY_FIELD,
  };
};

export const allergiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Allergies.GET_LIST: {
      return {
        ...state,
        error: false,
        allergiesList:
          action.response.entry?.map(allergy => {
            return convertAllergy(allergy.resource);
          }) || [],
      };
    }
    case Actions.Allergies.GET_LIST_ERROR: {
      return {
        ...state,
        error: true,
      };
    }
    case Actions.Allergies.GET_LIST_ERROR_RESET: {
      return {
        ...state,
        error: initialState.error,
      };
    }
    default:
      return state;
  }
};
