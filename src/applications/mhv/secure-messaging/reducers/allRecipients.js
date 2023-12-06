import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * List of ALL triage teams recipients
   * @type {array}
   */
  allRecipients: undefined,
};

export const allRecipientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.AllRecipients.GET_LIST:
      return {
        ...state,
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
