import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { DefaultFolders as Folders } from '../../util/constants';
import EmergencyNote from '../EmergencyNote';
import ManageFolderButtons from '../ManageFolderButtons';

const FolderHeader = props => {
  const { folder } = props;

  const handleHeader = () => {
    switch (folder.folderId) {
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

  const handleFolderDescription = () => {
    let text = '';
    switch (folder.folderId) {
      case Folders.INBOX.id:
      case Folders.SENT.id: // Inbox
        text = Folders.INBOX.desc;
        break;
      case Folders.DRAFTS.id: // Drafts
        text = Folders.DRAFTS.desc;
        break;
      case Folders.DELETED.id: // Trash
        text = Folders.DELETED.desc;
        break;
      default:
        text = ``;
        break;
    }
    return (
      text && (
        <p
          data-testid="folder-description"
          className="va-introtext folder-description vads-u-margin-top--0"
        >
          {text}
        </p>
      )
    );
  };

  return (
    <>
      <h1 data-testid="folder-header">{handleHeader()}</h1>
      <>{handleFolderDescription()}</>
      {folder.folderId === Folders.INBOX.id && (
        <>
          <EmergencyNote />
          <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
            <Link
              className="vads-c-action-link--blue compose-message-link"
              to="/compose"
              data-testid="compose-message-link"
            >
              Compose message
            </Link>
          </p>
        </>
      )}
      <ManageFolderButtons />
      <div className="search-messages-input">
        <label
          className="vads-u-margin-top--2p5"
          htmlFor="search-message-folder-input"
        >
          Search the {folder.name} messages folder
        </label>
        <VaSearchInput label="search-message-folder-input" ref={folder} />
      </div>
    </>
  );
};

FolderHeader.propTypes = {
  folder: PropTypes.object,
};

export default FolderHeader;
