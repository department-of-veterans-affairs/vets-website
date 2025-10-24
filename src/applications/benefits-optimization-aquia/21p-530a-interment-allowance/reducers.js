/**
 * Redux reducers for the 21P-530a form application (unauthenticated)
 * Uses empty reducer object since this is an unauthenticated form without save-in-progress
 * @module reducers
 */
export default {
  form: (state = {}, action) => {
    if (action.type === 'SET_DATA') {
      return {
        ...state,
        data: action.data,
      };
    }
    if (action.type === 'SET_EDIT_MODE') {
      return {
        ...state,
        ...action.edit,
      };
    }
    if (action.type === 'SET_PRIVACY_AGREEMENT') {
      return {
        ...state,
        privacyAgreementAccepted: action.privacyAgreementAccepted,
      };
    }
    if (action.type === 'SET_SUBMISSION') {
      return {
        ...state,
        submission: action.submission,
      };
    }
    return state;
  },
};
