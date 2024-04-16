import { Actions } from '../util/actionTypes';
import { findBlockedFacilities, formatRecipient } from '../util/helpers';

const initialState = {
  /**
   * List of ALL triage teams recipients
   * @type {array}
   */
  allRecipients: [],
  allowedRecipients: [],
  blockedRecipients: [],
  blockedFacilities: [],
  associatedTriageGroupsQty: undefined,
  associatedBlockedTriageGroupsQty: undefined,
  noAssociations: undefined,
  allTriageGroupsBlocked: undefined,
  error: undefined,
};

export const recipientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.AllRecipients.GET_LIST: {
      const {
        associatedTriageGroups,
        associatedBlockedTriageGroups,
      } = action.response.meta;
      const noAssociations = associatedTriageGroups === 0;
      const allTriageGroupsBlocked =
        !noAssociations &&
        associatedTriageGroups === associatedBlockedTriageGroups;
      return {
        ...state,
        associatedTriageGroupsQty: associatedTriageGroups,

        associatedBlockedTriageGroupsQty: associatedBlockedTriageGroups,

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

        noAssociations,

        allTriageGroupsBlocked,
      };
    }
    case Actions.AllRecipients.GET_LIST_ERROR:
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
};
