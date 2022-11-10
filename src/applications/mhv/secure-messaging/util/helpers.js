import moment from 'moment-timezone';
import { DefaultFolders as Folders } from './constants';

export const folderPathByFolderId = folderId => {
  let path = '';
  if (folderId !== null) {
    switch (folderId) {
      case Folders.INBOX.id:
        path = '/';
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

export const navigateToFoldersPage = history => {
  history.push('/folders');
};

/**
 * @param {*} timestamp
 * @param {*} format momentjs formatting guide found here https://momentjs.com/docs/#/displaying/format/
 * @returns {String} fromatted timestamp
 */
export const dateFormat = (timestamp, format = null) => {
  const timeZone = moment.tz.guess();
  return moment
    .tz(timestamp, timeZone)
    .format(format || 'MMMM d, YYYY, h:mm a z');
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
