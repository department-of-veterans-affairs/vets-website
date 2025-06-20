import { Actions } from '../util/actionTypes';
import { findBlockedFacilities, formatRecipient } from '../util/helpers';

const initialState = {
  /**
   * List of ALL triage teams recipients
   * @type {array}
   */
  allRecipients: [],
  allowedRecipients: [],
  recentRecipients: undefined,
  blockedRecipients: [],
  blockedFacilities: [],
  allFacilities: [],
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

      const facilities = findBlockedFacilities(action.response.data);
      const recipients = action.response.data.map(recipient => ({
        ...formatRecipient(recipient.attributes),
      }));

      return {
        ...state,
        associatedTriageGroupsQty:
          associatedTriageGroups === undefined ? null : associatedTriageGroups,

        associatedBlockedTriageGroupsQty: associatedBlockedTriageGroups,

        allRecipients: recipients,

        allowedRecipients: recipients
          .filter(
            recipient =>
              recipient.blockedStatus === false &&
              recipient.preferredTeam === true,
          )
          .map(recipient => formatRecipient(recipient)),

        blockedRecipients: recipients
          .filter(recipient => recipient.blockedStatus === true)
          .map(recipient => formatRecipient(recipient)),

        blockedFacilities: facilities.fullyBlockedFacilities,

        allFacilities: facilities.allFacilities,

        noAssociations,

        allTriageGroupsBlocked,
      };
    }
    case Actions.AllRecipients.GET_LIST_ERROR:
      return {
        ...state,
        error: true,
      };
    case Actions.AllRecipients.GET_RECENT: {
      // action.response is an array of triageTeamIds
      // allowedRecipients is an array of recipient objects with triageTeamId and name
      // Filter recent recipients to only include those that are allowed

      const allowedMap = new Map(
        state.allowedRecipients.map(r => [
          r.triageTeamId,
          { name: r.name, healthCareSystemName: r.healthCareSystemName },
        ]),
      );

      const filteredRecent = (action.response || [])
        .filter(id => allowedMap.has(id))
        .map(id => ({
          triageTeamId: id,
          ...allowedMap.get(id),
        }))
        .slice(0, 4);
      return {
        ...state,
        recentRecipients: filteredRecent || null,
      };
    }
    case Actions.AllRecipients.GET_RECENT_ERROR:
      return {
        ...state,
        recentRecipients: 'error',
      };
    default:
      return state;
  }
};
