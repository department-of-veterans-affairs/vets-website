import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {
  navigateToFolderByFolderId,
  unreadCountAllFolders,
} from '../../util/helpers';
import { DefaultFolders } from '../../util/constants';

const UnreadMessages = props => {
  const history = useHistory();

  return (
    <div className="unread-messages">
      {props.folders === null && (
        <h2>Unable to retrieve messages at this moment</h2>
      )}

      {props.folders && (
        <h2>
          {`You have ${unreadCountAllFolders(props.folders)} unread messages`}
        </h2>
      )}

      <p>You only have 45 days to respond before you can’t.</p>
      <va-button
        text="View Inbox"
        onClick={() => {
          navigateToFolderByFolderId(DefaultFolders.INBOX.id, history);
        }}
      />
    </div>
  );
};

UnreadMessages.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.object),
};

export default UnreadMessages;
