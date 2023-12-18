import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * List of ALL triage teams recipients
   * @type {array}
   */
  allRecipients: undefined,
  blockedRecipients: [],
  preferredTeams: [],
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

        allRecipients: action.response.data.map(recipient => {
          return {
            id: recipient.attributes.triageTeamId,
            name: recipient.attributes.name,
            stationNumber: recipient.attributes.stationNumber,
            blockedStatus: recipient.attributes.blockedStatus,
            preferredTeam: recipient.attributes.preferredTeam,
            relationshipType: recipient.attributes.relationshipType,
          };
        }),

        blockedRecipients: action.response.data
          .filter(
            recipient =>
              recipient.attributes.blockedStatus === true &&
              recipient.attributes.preferredTeam === true,
          )
          .map(recipient => {
            return {
              id: recipient.attributes.triageTeamId,
              name: recipient.attributes.name,
              stationNumber: recipient.attributes.stationNumber,
              blockedStatus: recipient.attributes.blockedStatus,
              preferredTeam: recipient.attributes.preferredTeam,
              relationshipType: recipient.attributes.relationshipType,
            };
          }),

        preferredTeams: action.response.data
          .filter(
            recipient =>
              recipient.attributes.blockedStatus === false &&
              recipient.attributes.preferredTeam === true,
          )
          .map(recipient => {
            return {
              id: recipient.attributes.triageTeamId,
              name: recipient.attributes.name,
              stationNumber: recipient.attributes.stationNumber,
              blockedStatus: recipient.attributes.blockedStatus,
              preferredTeam: recipient.attributes.preferredTeam,
              relationshipType: recipient.attributes.relationshipType,
            };
          }),
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
