import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { folderPathByFolderId } from '../util/helpers';
import { DefaultFolders as Folders } from '../util/constants';

const FoldersList = props => {
  const { folders, showUnread } = props;

  const folderNameDdAction = folderName => {
    const isCustomFolder =
      folderName !== Folders.INBOX.header &&
      folderName !== Folders.SENT.header &&
      folderName !== Folders.DRAFTS.header &&
      folderName !== Folders.DELETED.header;

    const ddTitle = `${
      isCustomFolder ? 'Custom' : `${folderName}`
    } Folder Link`;
    const ddPrivacy = `${isCustomFolder ? 'mask' : 'allow'}`;

    return { ddTitle, ddPrivacy };
  };

  return (
    <div className="vads-u-margin-top--2">
      <ul className="folders-list" data-dd-action-name="Folders List Container">
        {!!folders.length &&
          folders.map(folder => (
            <li
              key={folder.name}
              className="folder-link"
              data-testid={folder.name}
              data-dd-privacy="mask"
            >
              <Link to={folderPathByFolderId(folder.id)}>
                <div className="icon-span-container">
                  <va-icon icon="folder" size={3} aria-hidden="true" />
                  <span
                    className="vads-u-margin-left--1"
                    data-dd-privacy={folderNameDdAction(folder.name).ddPrivacy}
                    data-dd-action-name={
                      folderNameDdAction(folder.name).ddTitle
                    }
                  >
                    {folder.id === Folders.DELETED.id
                      ? Folders.DELETED.header
                      : folder.name}{' '}
                    {showUnread &&
                      folder.unreadCount > 0 &&
                      folder.id !== Folders.DRAFTS.id &&
                      `(${folder.unreadCount} unread messages)`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

FoldersList.propTypes = {
  folders: PropTypes.array,
  highlightId: PropTypes.string,
  showUnread: PropTypes.bool,
};

export default FoldersList;
