import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * whether the current user has VHIE sharing turned on
   * @type {boolean}
   */
  isSharing: undefined,

  /**
   * any error encountered while trying to fetch the status
   */
  statusError: undefined,
};

/**
 * Convert the consent_status from the backend to a true (opted in) or false (not opted in) value.
 *
 * @param {String} consentStatus
 * @returns {Boolean} true or false, or null if consentStatus has an unexpected value
 */
const convertConsentStatus = consentStatus => {
  if (consentStatus === 'OPT-IN') {
    return true;
  }
  if (consentStatus === 'OPT-OUT') {
    return false;
  }
  return null;
};

export const sharingReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Sharing.STATUS: {
      const { consentStatus } = action.response;
      return {
        ...state,
        isSharing: convertConsentStatus(consentStatus),
      };
    }
    case Actions.Sharing.STATUS_ERROR: {
      return {
        ...state,
        isSharing: null,
        statusError: action.response,
      };
    }
    case Actions.Sharing.UPDATE: {
      return {
        ...state,
        isSharing: action.response.optIn,
      };
    }
    case Actions.Sharing.CLEAR: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
