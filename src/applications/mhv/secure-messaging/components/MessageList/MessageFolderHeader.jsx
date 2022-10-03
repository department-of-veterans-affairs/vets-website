import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DefaultFolders as Folder } from '../../util/constants';
import EmergencyNote from '../EmergencyNote';

const MessageFolderHeader = props => {
  const handleHeader = () => {
    switch (props.folder.folderId) {
      case Folder.INBOX: // Inbox
        return `Messages`;
      case Folder.SENT: // Sent
        return `Sent messages`;
      case Folder.DRAFTS: // Drafts
        return `Drafts`;
      case Folder.DELETED: // Trash
        return `Trash`;
      default:
        return props.folder.name;
    }
  };

  const handleFolderDescription = () => {
    let text = '';
    switch (props.folder.folderId) {
      case Folder.INBOX || Folder.SENT: // Inbox
        text = `When you send a message to your care team, it can take up to 3
            business days to get a response.`;
        break;
      // case Folder.SENT: // Sent
      //   return `When you send a message to your care team, it can take up to 3
      //       business days to get a response.`;
      case Folder.DRAFTS: // Drafts
        text = ``;
        break;
      case Folder.DELETED: // Trash
        text = `Here are the messages you deleted from other folders. 
        You can't permanently delete messages.`;
        break;
      default:
        text = ``;
        break;
    }
    return text && <p className="va-introtext vads-u-margin-top--0">{text}</p>;
  };

  return (
    <>
      <h1>{handleHeader()}</h1>
      {props.folder.folderId === Folder.INBOX ? (
        <>
          <p className="va-introtext vads-u-margin-top--0">
            When you send a message to your care team, it can take up to 3
            business days to get a response.
          </p>
          <EmergencyNote />
          <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
            <Link
              className="vads-c-action-link--blue compose-message-link"
              to="/compose"
            >
              Compose message
            </Link>
          </p>
        </>
      ) : (
        <>{handleFolderDescription()}</>
      )}
    </>
  );
};

MessageFolderHeader.propTypes = {
  folder: PropTypes.object,
};

export default MessageFolderHeader;
