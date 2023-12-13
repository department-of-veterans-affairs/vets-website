import moment from 'moment-timezone';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { DefaultFolders as Folders, Paths } from './constants';

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

export const httpRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi; // Accepts 'http'
export const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi; // Accepts www and https

/**
 * Comparing a timestampt to current date and time, if older than days return true
 * @param {*} timestamp
 * @param {*} days
 * @returns {Boolean} true if timestamp is older than days
 */
export const isOlderThan = (timestamp, days) => {
  const now = moment();
  const then = moment(timestamp);
  return now.diff(then, 'days') > days;
};

export const getLastSentMessage = messages => {
  return messages.find(
    m =>
      m.attributes !== undefined
        ? m.attributes.sentDate !== null
        : m.sentDate !== null,
  );
};

// Opens the veterans Crisis modal (the modal that appears when clicking the red banner in the header (or footer on mobile) to connect to the crisis line)
export const openCrisisModal = () => {
  const modal = document.querySelector('#modal-crisisline');
  modal.setAttribute(
    'class',
    `${modal.getAttribute('class')} va-overlay--open`,
  );
  focusElement(document.querySelector('a[href="tel:988"]'));
};

export const handleHeader = (folderId, folder) => {
  switch (folderId) {
    case Folders.INBOX.id: // Inbox
      return Folders.INBOX.header;
    case Folders.SENT.id: // Sent
      return Folders.SENT.header;
    case Folders.DRAFTS.id: // Drafts
      return Folders.DRAFTS.header;
    case Folders.DELETED.id: // Trash
      return Folders.DELETED.header;
    default:
      return folder.name;
  }
};

export const updatePageTitle = newTitle => {
  document.title = newTitle;
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
    return `\n\n\n${singatureObj.signatureName}\n${
      singatureObj.signatureTitle
    }`;
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
