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
  allowedVistaFacilities: [],
  allowedOhFacilities: [],
  activeCareSystem: null,
  activeCareTeam: null,
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
              (state.activeCareSystem?.vhaId === undefined ||
                state.activeCareSystem?.vhaId === recipient.stationNumber),
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
        activeCareSystem: action.payload.careSystem,
        allowedRecipients: action.payload.recipients
          .filter(
            recipient =>
              recipient.blockedStatus === false &&
              recipient.preferredTeam === true &&
              action.payload.careSystem?.vhaId === recipient?.stationNumber,
          )
          .map(recipient => formatRecipient(recipient)),

        blockedRecipients: action.payload.recipients
          .filter(
            recipient =>
              action.payload.careSystem?.vhaId === recipient?.stationNumber &&
              recipient?.blockedStatus === true,
          )
          .map(recipient => formatRecipient(recipient)),
      };
    }
    case Actions.AllRecipients.SELECT_CARE_TEAM: {
      return {
        ...state,
        activeCareTeam: action.payload.careTeam,
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
