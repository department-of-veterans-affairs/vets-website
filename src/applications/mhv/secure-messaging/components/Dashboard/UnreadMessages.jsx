import React from 'react';
import { useHistory } from 'react-router-dom';
import { navigateToFolderByFolderId } from '../../util/helpers';
import { DefaultFolders } from '../../util/constants';

const UnreadMessages = () => {
  const history = useHistory();

  return (
    <div className="unread-messages">
      <h2>15 Unread Messages</h2>
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

export default UnreadMessages;
