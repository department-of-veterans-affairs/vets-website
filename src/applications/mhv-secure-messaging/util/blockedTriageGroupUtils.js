import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import {
  BlockedTriageAlertText,
  ParentComponent,
  RecipientStatus,
  Recipients,
} from './constants';

const { alertTitle, alertMessage } = BlockedTriageAlertText;

/**
 * Determines if a recipient is blocked by checking if they exist in the blocked recipients list.
 * @param {Object} recipients - The recipients state from Redux
 * @param {Object} recipient - The recipient to check
 * @returns {boolean} True if recipient is blocked
 */
const isRecipientBlocked = (recipients, recipient) => {
  if (!recipients?.blockedRecipients || !recipient) return false;

  return recipients.blockedRecipients.some(
    blocked =>
      blocked.id === recipient.recipientId ||
      blocked.name === recipient.name ||
      blocked.name === recipient.triageGroupName,
  );
};

/**
 * Determines if a recipient is associated with the user's account.
 * @param {Object} recipients - The recipients state from Redux
 * @param {Object} recipient - The recipient to check
 * @returns {boolean} True if recipient is associated
 */
const isRecipientAssociated = (recipients, recipient) => {
  if (!recipients?.allRecipients || !recipient) return false;

  return recipients.allRecipients.some(
    r =>
      r.id === recipient.recipientId ||
      r.name === recipient.name ||
      r.name === recipient.triageGroupName,
  );
};

/**
 * Determines the status of a recipient (ALLOWED, BLOCKED, or NOT_ASSOCIATED)
 * @param {Object} recipients - The recipients state from Redux
 * @param {Object} recipient - The recipient to check
 * @returns {string} RecipientStatus value
 */
export const getRecipientStatus = (recipients, recipient) => {
  if (!recipient) return null;

  const isAssociated = isRecipientAssociated(recipients, recipient);
  if (!isAssociated) return RecipientStatus.NOT_ASSOCIATED;

  const isBlocked = isRecipientBlocked(recipients, recipient);
  if (isBlocked) return RecipientStatus.BLOCKED;

  return RecipientStatus.ALLOWED;
};

/**
 * Sorts a list of triage groups/facilities alphabetically by name.
 * Non-alphabetic names are sorted first (to match the original sortRecipients behavior).
 * @param {Array} list - List of triage groups or facilities
 * @returns {Array} Sorted list
 */
export const sortTriageList = list => {
  if (!list?.length) return [];
  const isAlphabetical = str => /^\w/.test(str);
  return [...list].sort((a, b) => {
    const nameA = a.suggestedNameDisplay || a.name || '';
    const nameB = b.suggestedNameDisplay || b.name || '';
    // Non-alphabetical names come first, then alphabetical sorted
    return (
      isAlphabetical(nameA) - isAlphabetical(nameB) ||
      nameA.localeCompare(nameB)
    );
  });
};

/**
 * Converts blocked facilities (station numbers) to objects with names.
 * @param {Array} blockedFacilities - Array of station numbers
 * @param {Object} ehrDataByVhaId - EHR data from Drupal
 * @returns {Array} Array of facility objects with name and stationNumber
 */
export const getBlockedFacilityNames = (blockedFacilities, ehrDataByVhaId) => {
  if (!blockedFacilities?.length) return [];

  return blockedFacilities
    .filter(facility => getVamcSystemNameFromVhaId(ehrDataByVhaId, facility))
    .map(facility => ({
      stationNumber: facility,
      name: getVamcSystemNameFromVhaId(ehrDataByVhaId, facility),
      type: Recipients.FACILITY,
    }));
};

/**
 * Builds the list of blocked items to display in the alert.
 * Combines blocked recipients and facilities, excluding recipients from fully-blocked facilities.
 * @param {Array} blockedRecipients - List of blocked recipients
 * @param {Array} blockedFacilityObjects - List of blocked facility objects with names
 * @returns {Array} Combined and sorted list of blocked items
 */
export const buildBlockedItemsList = (
  blockedRecipients,
  blockedFacilityObjects,
) => {
  // If neither has items, return empty
  if (!blockedRecipients?.length && !blockedFacilityObjects?.length) return [];

  // If only blocked facilities (no individual blocked recipients)
  if (!blockedRecipients?.length && blockedFacilityObjects?.length) {
    return sortTriageList(blockedFacilityObjects);
  }

  // If only blocked recipients (no blocked facilities)
  if (!blockedFacilityObjects?.length && blockedRecipients?.length) {
    return sortTriageList(blockedRecipients);
  }

  // If 1 or fewer blocked recipients, just return them (don't combine with facilities)
  // This handles the case where we want to show just the blocked recipient
  if (blockedRecipients?.length <= 1) {
    return sortTriageList(blockedRecipients || []);
  }

  // Both have items - exclude individual teams that belong to fully blocked facilities
  const teamsNotInBlockedFacilities = blockedRecipients.filter(
    team =>
      !blockedFacilityObjects.some(
        facility => facility.stationNumber === team.stationNumber,
      ),
  );

  return [
    ...sortTriageList(teamsNotInBlockedFacilities),
    ...sortTriageList(blockedFacilityObjects),
  ];
};

/**
 * Helper function to get alert configuration for a list of blocked items.
 * @param {Array} blockedList - List of blocked items
 * @returns {Object} Alert configuration
 */
const getAlertConfigForBlockedList = blockedList => {
  if (blockedList.length === 1) {
    const item = blockedList[0];
    const name = item.suggestedNameDisplay || item.name;

    if (item.type === Recipients.FACILITY) {
      return {
        shouldShow: true,
        title: `You can't send messages to care teams at ${name}`,
        message: alertMessage.SINGLE_FACILITY_BLOCKED,
        blockedList,
        status: RecipientStatus.BLOCKED,
      };
    }

    if (item.status === RecipientStatus.NOT_ASSOCIATED) {
      return {
        shouldShow: true,
        title: `Your account is no longer connected to ${name}`,
        message: alertMessage.NO_ASSOCIATIONS,
        blockedList,
        status: RecipientStatus.NOT_ASSOCIATED,
      };
    }

    return {
      shouldShow: true,
      title: `You can't send messages to ${name}`,
      message: alertMessage.SINGLE_TEAM_BLOCKED,
      blockedList,
      status: RecipientStatus.BLOCKED,
    };
  }

  // Multiple blocked items
  return {
    shouldShow: true,
    title: alertTitle.MULTIPLE_TEAMS_BLOCKED,
    message: alertMessage.MULTIPLE_TEAMS_BLOCKED,
    blockedList,
    status: RecipientStatus.BLOCKED,
  };
};

/**
 * Determines the alert configuration based on the blocked triage group state.
 *
 * @param {Object} params - Configuration object
 * @param {Object} params.recipients - Recipients state from Redux
 * @param {Object} params.currentRecipient - The current recipient (if viewing a thread or draft)
 * @param {string} params.parentComponent - Which component is rendering the alert
 * @param {Object} params.ehrDataByVhaId - EHR data for facility name resolution
 * @param {boolean} params.isOhMessage - Whether this is an Oracle Health message
 * @param {boolean} params.facilityMigratingToOhInErrorPhase - Whether the user's facility is in an error phase
 * @returns {Object|null} Alert configuration with { shouldShow, title, message, blockedList, status }
 */
export const getBlockedTriageAlertConfig = ({
  recipients,
  currentRecipient,
  parentComponent,
  ehrDataByVhaId,
  isOhMessage = false,
  facilityMigratingToOhInErrorPhase = false,
}) => {
  const {
    noAssociations,
    allTriageGroupsBlocked,
    associatedBlockedTriageGroupsQty,
    blockedRecipients,
    blockedFacilities,
  } = recipients || {};

  // If we haven't loaded the data yet, don't show anything
  if (associatedBlockedTriageGroupsQty === undefined) {
    return null;
  }

  // Get blocked facility objects with names
  const blockedFacilityObjects = getBlockedFacilityNames(
    blockedFacilities,
    ehrDataByVhaId,
  );

  // Handle current recipient scenarios first (thread, reply, draft editing)
  // This takes priority over noAssociations for specific recipient messaging
  if (currentRecipient) {
    const recipientStatus = getRecipientStatus(recipients, currentRecipient);
    const formattedRecipient = {
      ...currentRecipient,
      status: recipientStatus,
    };

    // SCENARIO: Current recipient is NOT_ASSOCIATED
    if (recipientStatus === RecipientStatus.NOT_ASSOCIATED) {
      // If user has no associations at all and we're in compose form,
      // show the global "no associations" message
      if (noAssociations && parentComponent === ParentComponent.COMPOSE_FORM) {
        return {
          shouldShow: true,
          title: alertTitle.NO_ASSOCIATIONS,
          message: alertMessage.NO_ASSOCIATIONS,
          blockedList: [],
          status: null,
        };
      }

      // Oracle Health messages don't show alert for NOT_ASSOCIATED
      if (isOhMessage) {
        return null;
      }

      // Build the combined list including the not-associated recipient
      const baseBlockedList = buildBlockedItemsList(
        blockedRecipients,
        blockedFacilityObjects,
      );
      const blockedList = baseBlockedList.length
        ? sortTriageList([...baseBlockedList, formattedRecipient])
        : [formattedRecipient];

      // If multiple items, use MULTIPLE_TEAMS_BLOCKED title (matching original behavior)
      if (blockedList.length > 1) {
        return {
          shouldShow: true,
          title: alertTitle.MULTIPLE_TEAMS_BLOCKED,
          message: alertMessage.MULTIPLE_TEAMS_BLOCKED,
          blockedList,
          status: RecipientStatus.NOT_ASSOCIATED,
        };
      }

      // Single not-associated recipient
      const name =
        currentRecipient.suggestedNameDisplay || currentRecipient.name;
      return {
        shouldShow: true,
        title: `Your account is no longer connected to ${name}`,
        message: alertMessage.NO_ASSOCIATIONS,
        blockedList,
        status: RecipientStatus.NOT_ASSOCIATED,
      };
    }

    // SCENARIO: Current recipient is BLOCKED
    if (recipientStatus === RecipientStatus.BLOCKED) {
      // If ALL teams are blocked, show the all-blocked alert
      if (allTriageGroupsBlocked) {
        return {
          shouldShow: true,
          title: alertTitle.ALL_TEAMS_BLOCKED,
          message: alertMessage.ALL_TEAMS_BLOCKED,
          blockedList: [],
          status: RecipientStatus.BLOCKED,
        };
      }

      // In ComposeForm, show all blocked teams; in other contexts, show just the current one
      if (parentComponent === ParentComponent.COMPOSE_FORM) {
        const blockedList = buildBlockedItemsList(
          blockedRecipients,
          blockedFacilityObjects,
        );
        if (!blockedList.length) return null;

        return getAlertConfigForBlockedList(blockedList);
      }

      const name =
        currentRecipient.suggestedNameDisplay || currentRecipient.name;
      return {
        shouldShow: true,
        title: `You can't send messages to ${name}`,
        message: alertMessage.SINGLE_TEAM_BLOCKED,
        blockedList: [formattedRecipient],
        status: RecipientStatus.BLOCKED,
      };
    }

    // Recipient is ALLOWED - no alert needed for the current recipient
    // But in ComposeForm, still show blocked teams alert if there are any
    if (parentComponent === ParentComponent.COMPOSE_FORM) {
      const blockedList = buildBlockedItemsList(
        blockedRecipients,
        blockedFacilityObjects,
      );
      if (blockedList.length) {
        return getAlertConfigForBlockedList(blockedList);
      }
    }

    // No alert needed for ALLOWED recipient
    return null;
  }

  // No current recipient - handle global states

  // SCENARIO: No associations at all
  if (noAssociations && !facilityMigratingToOhInErrorPhase) {
    return {
      shouldShow: true,
      title: alertTitle.NO_ASSOCIATIONS,
      message: alertMessage.NO_ASSOCIATIONS,
      blockedList: [],
      status: null,
    };
  }

  // SCENARIO: All teams are blocked
  if (allTriageGroupsBlocked) {
    return {
      shouldShow: true,
      title: alertTitle.ALL_TEAMS_BLOCKED,
      message: alertMessage.ALL_TEAMS_BLOCKED,
      blockedList: [],
      status: RecipientStatus.BLOCKED,
    };
  }

  // No current recipient - check if we should show blocked teams alert
  const showBlockedAlert =
    parentComponent === ParentComponent.COMPOSE_FORM ||
    parentComponent === ParentComponent.CONTACT_LIST ||
    parentComponent === ParentComponent.FOLDER_HEADER;

  if (showBlockedAlert) {
    const blockedList = buildBlockedItemsList(
      blockedRecipients,
      blockedFacilityObjects,
    );
    if (blockedList.length) {
      return getAlertConfigForBlockedList(blockedList);
    }
  }

  return null;
};

/**
 * Sanitizes the alert title for Datadog analytics to avoid PII/PHI.
 * @param {string} title - The alert title
 * @returns {string} Sanitized title for analytics
 */
export const getAnalyticsAlertType = title => {
  if (!title) return '';

  if (title.includes("You can't send messages to care teams at")) {
    return "You can't send messages to care teams at FACILITY";
  }
  if (title.includes("You can't send messages to some of your care teams")) {
    return title;
  }
  if (title.includes("You can't send messages to your care teams right now")) {
    return title;
  }
  if (title.includes("You can't send messages to")) {
    return "You can't send messages to TG_NAME";
  }
  if (title.includes('Your account is no longer connected to')) {
    return 'Your account is no longer connected to TG_NAME';
  }

  return title;
};
