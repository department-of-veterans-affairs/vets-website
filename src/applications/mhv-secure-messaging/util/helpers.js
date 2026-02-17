import moment from 'moment-timezone';
import DOMPurify from 'dompurify';
import {
  scrollToElement,
  scrollToTop as scrollToTopUtil,
} from 'platform/utilities/scroll';
import { datadogRum } from '@datadog/browser-rum';
import {
  DefaultFolders as Folders,
  Paths,
  RecipientStatus,
  Recipients,
  PageTitles,
  OhMigrationPhasesBlockingReplies,
} from './constants';

/**
 * @param {Object} file The attachment file that is uploaded or saved within a message thread
 * file.lastModified ~ this id is used on newly uploaded attachments that contain no existing id
 * file.id ~ this id is used on saved attachments within a message thread
 *
 */
export const handleRemoveAttachmentButtonId = file => {
  return file.id === undefined
    ? `remove-attachment-button-${file.lastModified}`
    : `remove-attachment-button-${file.id}`;
};
export const handleRemoveAttachmentModalId = file => {
  return file.id === undefined
    ? `remove-attachment-modal-${file.lastModified}`
    : `remove-attachment-modal-${file.id}`;
};
///

// Only use with window.location.pathname **DO NOT USE WITH useLocation() hooks**
export const getLastPathName = pathname => {
  const paths = pathname.split('/').filter(Boolean);
  return (
    paths[paths.length - 1].charAt(0).toUpperCase() +
    paths[paths.length - 1].slice(1)
  );
};

// Only use with useLocation() hook **Can add custom string name for landing page**
export const formatPathName = (pathname, string) => {
  // Split the pathname into parts
  const parts = pathname.split('/').filter(Boolean);

  // If the pathname is "/", return string
  if (parts.length === 0) {
    return string;
  }

  // Get the last part of the pathname
  const lastPart = parts[parts.length - 1];

  // Capitalize the first letter and return
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};

export const folderPathByFolderId = folderId => {
  let path = '';
  if (folderId !== null) {
    switch (parseInt(folderId, 10)) {
      case Folders.INBOX.id:
        path = Paths.INBOX;
        break;
      case Folders.DRAFTS.id:
        path = Paths.DRAFTS;
        break;
      case Folders.SENT.id:
        path = Paths.SENT;
        break;
      case Folders.DELETED.id:
        path = Paths.DELETED;
        break;
      default:
        path = `${Paths.FOLDERS}${folderId}/`;
        break;
    }
  } else {
    path = '/';
  }
  return path;
};

export const navigateToFolderByFolderId = (folderId, history) => {
  history.push(folderPathByFolderId(folderId));
};

export const navigateToFoldersPage = history => {
  history.push(Paths.FOLDERS);
};

export const today = new Date();

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} fromatted timestamp
 */

export const dateFormat = (timestamp, format = null) => {
  moment.updateLocale('en', {
    meridiem: hour => {
      if (hour < 12) {
        return 'a.m.';
      }
      return 'p.m.';
    },
  });
  const timeZone = moment.tz.guess();
  return moment
    .tz(timestamp, timeZone)
    .format(format || 'MMMM D, YYYY, h:mm a z');
};

export const threadsDateFormat = (timestamp, format = null) => {
  moment.updateLocale('en', {
    meridiem: hour => {
      if (hour < 12) {
        return 'a.m.';
      }
      return 'p.m.';
    },
  });
  const timeZone = moment.tz.guess();
  return moment
    .tz(timestamp, timeZone)
    .format(format || 'MMMM D, YYYY [at] h:mm a z');
};

export const sortRecipients = recipientsList => {
  const isAlphabetical = str => /^\w/.test(str);
  let list = [];
  if (recipientsList.length > 0) {
    list = recipientsList.sort(
      (a, b) =>
        isAlphabetical(a.name) - isAlphabetical(b.name) ||
        a.name.localeCompare(b.name),
    );
  }
  return list;
};

export const titleCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const httpRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi; // Accepts 'http'
export const urlRegex =
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi; // Accepts www and https

export const decodeHtmlEntities = str => {
  const parser = new DOMParser();
  const sanitizedStr = DOMPurify.sanitize(str);
  return (
    parser.parseFromString(sanitizedStr, 'text/html').body.textContent || ''
  );
};

/**
 * Validates if a date string from VaDate is complete and valid.
 * VaDate returns strings like "2026-01-04" for complete dates,
 * or "--04", "2026--04", "-01-04" for partial dates.
 * @param {string} dateValue - The date value from VaDate component
 * @returns {boolean} - true if date is valid and complete, false otherwise
 */
export const isValidDateValue = dateValue => {
  if (!dateValue) return false;
  // Check for invalid date patterns (missing year, month, or day)
  if (dateValue.includes('--') || dateValue.startsWith('-')) return false;
  // Validate format: YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateValue)) return false;
  // Parse and validate actual date
  const date = moment(dateValue, 'YYYY-MM-DD', true);
  return date.isValid();
};

/**
 * Comparing a timestamp to current date and time, if older than days return true
 * @param {*} timestamp
 * @param {*} days
 * @returns {Boolean} true if timestamp is older than days
 */
export const isOlderThan = (timestamp, days) => {
  const now = moment();
  const then = moment(timestamp);
  return now.diff(then, 'days') > days;
};

/**
 * Check if the OH migration phase blocks replies.
 * During facility migration from VistA to Oracle Health, replies are blocked
 * during phases p3, p4, p5 (T-6 through T+2).
 * @param {string} ohMigrationPhase - The migration phase from the message
 * @returns {Boolean} true if the phase blocks replies
 */
export const isMigrationPhaseBlockingReplies = ohMigrationPhase => {
  return OhMigrationPhasesBlockingReplies.includes(ohMigrationPhase);
};

export const getLastSentMessage = messages => {
  return messages.find(m =>
    m.attributes !== undefined
      ? m.attributes.sentDate !== null
      : m.sentDate !== null,
  );
};

export const isCustomFolder = folderId => {
  return folderId > 0;
};

export const handleHeader = folder => {
  const { folderId } = folder;

  const folderName =
    Object.values(Folders).find(f => f.id === folderId)?.header || folder.name;

  const ddTitle = `${
    isCustomFolder(folderId) ? 'Custom Folder' : `Messages: ${folderName}`
  } h1`;
  const ddPrivacy = `${isCustomFolder(folderId) ? 'mask' : 'allow'}`;

  return {
    folderName,
    ddTitle,
    ddPrivacy,
  };
};

export const getPageTitle = ({ folderName, pathname }) => {
  const systemFolderHeaders = [
    Folders.INBOX.header,
    Folders.SENT.header,
    Folders.DRAFTS.header,
    Folders.DELETED.header,
  ];

  const isSystemFolder = systemFolderHeaders.includes(folderName);

  if (folderName) {
    const titleTag = PageTitles.DEFAULT_PAGE_TITLE_TAG;
    return `${`Messages: ${
      folderName && isSystemFolder ? folderName : 'More folders'
    } ${titleTag}`}`;
  }

  const folderTitleTag = PageTitles.MY_FOLDERS_PAGE_TITLE_TAG;
  const conversationTitleTag = PageTitles.CONVERSATION_TITLE_TAG;

  return `Messages: ${
    pathname === Paths.FOLDERS ? folderTitleTag : conversationTitleTag
  }`;
};

export const updateMessageInThread = (thread, response) => {
  const { data, included } = response;
  const updatedMessage = data.attributes;
  return thread.map(message => {
    if (message.messageId === updatedMessage.messageId) {
      const msgAttachments =
        included &&
        included.map(item => ({
          id: item.id,
          link: item.links.download,
          ...item.attributes,
        }));
      return {
        // some fields in the thread object are not returned in the /read message response
        // so we need to preserve them for the thread
        threadId: message.threadId,
        folderId: message.folderId,
        draftDate: message.draftDate,
        toDate: message.toDate,
        ...updatedMessage,
        attachments: msgAttachments,
        preloaded: true, // this is used to determine if we need to fetch the message body again on expand
      };
    }
    return message;
  });
};

export const updateDrafts = draft => {
  if (Array.isArray(draft)) {
    return draft;
  }
  if (typeof draft === 'object') {
    return [draft[0]];
  }
  return [draft[0]];
};

// navigation helper
export const setUnsavedNavigationError = (
  typeOfError,
  setNavigationError,
  ErrorMessages,
) => {
  switch (typeOfError) {
    case ErrorMessages.Navigation.UNABLE_TO_SAVE_DRAFT_ATTACHMENT_ERROR:
      setNavigationError({
        ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
      });
      break;
    case ErrorMessages.Navigation.UNABLE_TO_SAVE_ERROR:
      setNavigationError({
        ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
      });
      break;
    default:
      setNavigationError(null);
  }
};

export const getSize = num => {
  if (num >= 1024 * 1024) {
    return `${(num / 1024 / 1024).toFixed(1)} MB`;
  }
  if (num >= 1024) {
    return `${(num / 1024).toFixed(1)} KB`;
  }
  return `${num} B`;
};

export const convertPathNameToTitleCase = str => {
  const formattedStr = str.replace(/\//g, '').trim(); // Remove slashes and trim whitespace
  const words = formattedStr.split('_'); // Split the string by underscores

  const capitalizedWords = words.map(word => {
    const lowerCasedWord = word.toLowerCase();
    return lowerCasedWord.charAt(0).toUpperCase() + lowerCasedWord.slice(1);
  });

  return capitalizedWords.join(' '); // Join the words with spaces
};

export const messageSignatureFormatter = singatureObj => {
  if (singatureObj?.includeSignature) {
    return `\n\n\n${singatureObj.signatureName}\n${singatureObj.signatureTitle}`;
  }
  return null;
};

/**
 * Setting a text input cursor to a specific position
 * @param {*} input
 * @param {*} pos
 */
export const setCaretToPos = (input, pos) => {
  input.focus();
  input.setSelectionRange(pos, pos);
};

export const resetUserSession = localStorageValues => {
  const timeout = setTimeout(() => {
    Object.keys(localStorageValues).forEach(storageItem => {
      if (!localStorage.getItem(storageItem)) {
        localStorage.setItem(storageItem, localStorageValues[storageItem]);
      }
    });
  }, 1000);
  return { signOutMessage: 'non-empty string', timeOutId: timeout };
};

export const checkTriageGroupAssociation = tempRecipient => {
  return recipient =>
    recipient.id === tempRecipient.recipientId ||
    recipient.name === tempRecipient.name ||
    recipient.name === tempRecipient.triageGroupName;
};

export const updateTriageGroupRecipientStatus = (recipients, tempRecipient) => {
  const formattedRecipient = tempRecipient;

  // isBlocked means TG exists in the blockedRecipients list (preferred can be either true or false)
  const isBlocked = recipients?.blockedRecipients?.some(
    checkTriageGroupAssociation(formattedRecipient),
  );

  // isAssociated means the TG exists in the allRecipients list (blocked can be true or false; preferred can be true or false)
  const isAssociated = recipients?.allRecipients?.some(
    checkTriageGroupAssociation(formattedRecipient),
  );

  // if TG is not associated or is blocked, formattedRecipient will include status of "not associated" or "blocked"
  if (formattedRecipient) {
    if (!isAssociated) {
      formattedRecipient.status = RecipientStatus.NOT_ASSOCIATED;
    } else if (isBlocked) {
      formattedRecipient.status = RecipientStatus.BLOCKED;
    } else {
      formattedRecipient.status = RecipientStatus.ALLOWED;
    }
  }

  return { isAssociated, isBlocked, formattedRecipient };
};

export const formatRecipient = recipient => {
  return {
    ...recipient,
    id: recipient.triageTeamId,
    type: Recipients.CARE_TEAM,
    status: recipient.blockedStatus
      ? RecipientStatus.BLOCKED
      : RecipientStatus.ALLOWED,
  };
};

export const findBlockedFacilities = recipients => {
  const blockedFacilities = new Set();
  const allowedFacilities = new Set();
  const facilityList = new Set();
  const fullyBlockedFacilities = [];

  recipients.forEach(recipient => {
    const { stationNumber, blockedStatus } = recipient.attributes;

    facilityList.add(recipient.attributes.stationNumber);

    if (blockedStatus === true) {
      blockedFacilities.add(stationNumber);
    } else {
      allowedFacilities.add(stationNumber);
    }
  });

  blockedFacilities.forEach(facility => {
    if (!allowedFacilities.has(facility)) {
      fullyBlockedFacilities.push(facility);
    }
  });

  const allFacilities = [...facilityList];

  return { fullyBlockedFacilities, allFacilities };
};

export const findAllowedFacilities = recipients => {
  const allowedVistaFacilities = new Set();
  const allowedOracleFacilities = new Set();

  recipients.forEach(recipient => {
    const { stationNumber, blockedStatus, ohTriageGroup } = recipient;

    if (blockedStatus === false) {
      if (ohTriageGroup === true) {
        allowedOracleFacilities.add(stationNumber);
      } else {
        allowedVistaFacilities.add(stationNumber);
      }
    }
  });

  return {
    allowedVistaFacilities: [...allowedVistaFacilities],
    allowedOracleFacilities: [...allowedOracleFacilities],
  };
};

export const getStationNumberFromRecipientId = (recipientId, recipients) => {
  const recipient = recipients?.find(item => item.triageTeamId === recipientId);
  return recipient?.stationNumber || null;
};

export const findActiveDraftFacility = (facilityId, facilitiesArray) => {
  const facility = facilitiesArray.find(item => item.vhaId === facilityId);
  return facility || null;
};

export const sortTriageList = list => {
  return list?.sort((a, b) => a.name?.localeCompare(b.name)) || [];
};

export const scrollTo = (element, behavior = 'smooth') => {
  if (element) {
    scrollToElement(element, { behavior });
  }
};

export const scrollToTop = () => scrollToTopUtil();

export const scrollIfFocusedAndNotInView = (offset = 0) => {
  const element = document.activeElement; // Get the currently focused element

  if (element) {
    const rect = element.getBoundingClientRect();

    // Check if the element is out of the viewport
    const inViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    if (!inViewport) {
      scrollToElement(element, {
        offset: offset * -1,
      });
    }
  }
};

export const sendDatadogError = (error, feature) => {
  datadogRum.addError(error, {
    app: 'Secure Messaging',
    feature,
  });
};

/**
 * Builds the message body for prescription renewal requests
 * @param {Object} rx - The prescription object containing details
 * @returns {string} Formatted message body with prescription information
 */
export const buildRxRenewalMessageBody = (rx, rxError) => {
  const getProviderNameValue = () => {
    if (rxError) return '';

    return (
      [rx?.providerFirstName, rx?.providerLastName].filter(Boolean).join(' ') ||
      'Provider name not available'
    );
  };

  const getRefillRemainingValue = () => {
    if (rxError) return '';
    if (
      rx?.refillRemaining !== null &&
      rx?.refillRemaining !== undefined &&
      rx?.refillRemaining !== '' &&
      !Number.isNaN(rx.refillRemaining)
    ) {
      return rx.refillRemaining;
    }
    return 'Number of refills left not available';
  };

  const getDateValue = (date, isDispensedDate = false) => {
    if (rxError) return '';
    if (date) {
      return dateFormat(date, 'MMMM D, YYYY');
    }
    return isDispensedDate ? 'Not filled yet' : 'Date not available';
  };

  return [
    `Medication name, strength, and form: ${
      rxError ? '' : rx?.prescriptionName || ''
    }`,
    `Prescription number: ${
      rxError
        ? ''
        : rx?.prescriptionNumber || 'Prescription number not available'
    }`,
    `Instructions: ${rxError ? '' : rx?.sig || 'Instructions not available'}`,
    `Provider who prescribed it: ${getProviderNameValue()}`,
    `Number of refills left: ${getRefillRemainingValue()}`,
    `Prescription expiration date: ${getDateValue(rx?.expirationDate)}`,
    `Reason for use: ${
      rxError ? '' : rx?.reason || 'Reason for use not available'
    }`,
    `Last filled on: ${getDateValue(rx?.sortedDispensedDate, true)}`,
    `Quantity: ${rxError ? '' : rx?.quantity || 'Quantity not available'}`,
  ].join('\n');
};

export const draftIsClean = draftInProgress => {
  return (
    !draftInProgress?.messageId &&
    !draftInProgress?.category &&
    !draftInProgress?.subject &&
    !draftInProgress?.body &&
    (!draftInProgress?.attachments || draftInProgress.attachments.length === 0)
  );
};
