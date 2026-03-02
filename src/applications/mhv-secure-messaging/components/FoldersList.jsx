import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { folderPathByFolderId, isCustomFolder } from '../util/helpers';
import { DefaultFolders as Folders } from '../util/constants';

const FoldersList = props => {
  const { folders, showUnread, highlightName } = props;

  const folderNameDdAction = useCallback(folder => {
    const { id } = folder;

    const ddTitle = `${
      isCustomFolder(id) ? 'Custom' : `${folder.name}`
    } Folder Link`;
    const ddPrivacy = `${isCustomFolder(id) ? 'mask' : 'allow'}`;

    return { ddTitle, ddPrivacy };
  }, []);

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
                    data-dd-privacy={folderNameDdAction(folder).ddPrivacy}
                    data-dd-action-name={folderNameDdAction(folder).ddTitle}
                  >
                    {folder.id === Folders.DELETED.id
                      ? Folders.DELETED.header
                      : folder.name}{' '}
                    {highlightName &&
                      folder.name === highlightName && (
                        <span
                          className="usa-label vads-u-background-color--primary vads-u-margin-left--1"
                          data-testid="folder-new-tag"
                        >
                          NEW
                        </span>
                      )}
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
  highlightName: PropTypes.string,
  showUnread: PropTypes.bool,
};

export default FoldersList;
