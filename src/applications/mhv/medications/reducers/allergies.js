// TODO: consider re-using medical-records reducer
/* eslint-disable sonarjs/no-small-switch */
import { Actions } from '../util/actionTypes';
import { convertAllergy } from '../../medical-records/reducers/allergies';

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
