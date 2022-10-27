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
