import { Actions } from '../util/actionTypes';
import {
  findAllowedFacilities,
  findBlockedFacilities,
  formatRecipient,
} from '../util/helpers';

const initialState = {
  /**
   * List of ALL triage teams recipients
   * @type {array}
   */
  allRecipients: [],
  allowedRecipients: [],
  vistaRecipients: [],
  recentRecipients: undefined,
  blockedRecipients: [],
  blockedFacilities: [],
  allFacilities: [],
  vistaFacilities: [],
  allowedOhFacilities: [],
  activeCareSystem: null,
  activeCareTeam: null,
  activeDraftId: null,
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
      const noAssociations =
        associatedTriageGroups === 0 || action.response?.data?.length === 0;
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

        allowedRecipients: recipients.filter(
          recipient =>
            recipient.blockedStatus === false &&
            recipient.preferredTeam === true &&
            (state.activeCareSystem?.vhaId === undefined ||
              state.activeCareSystem?.vhaId === recipient.stationNumber),
        ),

        vistaFacilities: findAllowedFacilities(recipients)
          .allowedVistaFacilities,

        vistaRecipients: recipients
          .filter(recipient => recipient.ohTriageGroup !== true)
          .map(recipient => formatRecipient(recipient)),

        activeCareSystem: action.response.meta.activeCareSystem || null,
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
          {
            ...r,
            name: r.suggestedNameDisplay || r.name,
          },
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
    case Actions.AllRecipients.RESET_RECENT:
      return {
        ...state,
        recentRecipients: undefined,
      };
    case Actions.AllRecipients.GET_RECENT_ERROR:
      return {
        ...state,
        recentRecipients: { error: 'error' },
      };
    default:
      return state;
  }
};
