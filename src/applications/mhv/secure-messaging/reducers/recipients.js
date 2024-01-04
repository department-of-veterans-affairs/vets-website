import { Actions } from '../util/actionTypes';
import { findBlockedFacilities, formatRecipient } from '../util/helpers';

const initialState = {
  /**
   * List of ALL triage teams recipients
   * @type {array}
   */
  allRecipients: undefined,
  allowedRecipients: [],
  blockedRecipients: [],
  blockedFacilities: [],
  associatedTriageGroupsQty: undefined,
  associatedBlockedTriageGroupsQty: undefined,
};

export const recipientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.AllRecipients.GET_LIST:
      return {
        ...state,
        associatedTriageGroupsQty: action.response.meta.associatedTriageGroups,

        associatedBlockedTriageGroupsQty:
          action.response.meta.associatedBlockedTriageGroups,

        allRecipients: action.response.data.map(recipient =>
          formatRecipient(recipient),
        ),

        allowedRecipients: action.response.data
          .filter(
            recipient =>
              recipient.attributes.blockedStatus === false &&
              recipient.attributes.preferredTeam === true,
          )
          .map(recipient => formatRecipient(recipient)),

        blockedRecipients: action.response.data
          .filter(recipient => recipient.attributes.blockedStatus === true)
          .map(recipient => formatRecipient(recipient)),

        blockedFacilities: findBlockedFacilities(action.response.data),
      };
    case Actions.AllRecipients.GET_LIST_ERROR:
      return {
        ...state,
        allRecipients: 'error',
      };
    default:
      return state;
  }
};
