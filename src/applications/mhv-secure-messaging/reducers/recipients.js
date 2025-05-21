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
  allFacilities: [],
  activeFacility: undefined,
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
              recipient.preferredTeam === true &&
              (state.activeFacility?.vhaId === undefined ||
                state.activeFacility?.vhaId === recipient.stationNumber),
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
    case Actions.AllRecipients.SELECT_HEALTH_CARE_SYSTEM: {
      return {
        ...state,
        activeFacility: action.payload.facility,
        allowedRecipients: action.payload.recipients
          .filter(
            recipient =>
              recipient.blockedStatus === false &&
              recipient.preferredTeam === true &&
              action.payload.facility?.vhaId === recipient?.stationNumber,
          )
          .map(recipient => formatRecipient(recipient)),

        blockedRecipients: action.payload.recipients
          .filter(
            recipient =>
              action.payload.facility?.vhaId === recipient?.stationNumber &&
              recipient?.blockedStatus === true,
          )
          .map(recipient => formatRecipient(recipient)),
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
