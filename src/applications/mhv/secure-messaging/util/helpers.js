import moment from 'moment-timezone';
import { DefaultFolders as Folders } from './constants';

export const folderPathByFolderId = folderId => {
  let path = '';
  if (folderId !== null) {
    switch (folderId) {
      case Folders.INBOX.id:
        path = '/inbox';
        break;
      case Folders.DRAFTS.id:
        path = '/drafts';
        break;
      case Folders.SENT.id:
        path = '/sent';
        break;
      case Folders.DELETED.id:
        path = '/trash';
        break;
      default:
        path = `/folder/${folderId}`;
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

export const unreadCountAllFolders = folders => {
  return folders
    .filter(folder => folder.id !== Folders.DRAFTS.id)
    .reduce((a, b) => a + b.unreadCount, 0);
};

export const navigateToFoldersPage = history => {
  history.push('/folders');
};

export const today = new Date();

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} fromatted timestamp
 */

export const dateFormat = (timestamp, format = null) => {
  const timeZone = moment.tz.guess();
  return moment
    .tz(timestamp, timeZone)
    .format(format || 'MMMM D, YYYY, h:mm a z');
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
