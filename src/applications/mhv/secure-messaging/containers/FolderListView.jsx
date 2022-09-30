import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMessages } from '../actions/messages';
import useInterval from '../hooks/use-interval';
import InboxListView from '../components/MessageList/InboxListView';
import MessageFolderHeader from '../components/MessageList/MessageFolderHeader';
import { retrieveFolder } from '../actions/folders';

const FolderListView = () => {
  const dispatch = useDispatch();
  const { folderId } = useParams();
  const error = null;
  const messages = useSelector(state => state.sm.messages?.messageList);
  const folder = useSelector(state => state.sm.folders.folder);

  useEffect(
    () => {
      if (folderId) {
        dispatch(retrieveFolder(folderId));
        dispatch(getMessages(folderId));
      }
    },
    [folderId, dispatch],
  );

  useInterval(() => {
    if (folder) {
      dispatch(getMessages(folder.folderId, true));
    }
  }, 5000);

  let content;
  if (messages === undefined) {
    content = (
      <va-loading-indicator
        message="Loading your secure messages..."
        setFocus
      />
    );
  } else if (messages.length === 0) {
    // this is a temporary content. There is a separate story to handle empty folder messaging
    content = (
      <va-alert status="error" visible>
        <h2 slot="headline">No messages</h2>
        <p>There are no messages in this folder</p>
      </va-alert>
    );
  } else if (error) {
    content = (
      <va-alert status="error" visible>
        <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
        <p>
          You can’t view your secure messages because something went wrong on
          our end. Please check back soon.
        </p>
      </va-alert>
    );
  } else if (messages.length > 0) {
    content = (
      <>
        <InboxListView messages={messages} />
      </>
    );
  }

  return (
    <div className="vads-l-grid-container">
      <div className="main-content">
        {folder === undefined ? (
          <va-loading-indicator
            message="Loading your secure messages..."
            setFocus
          />
        ) : (
          <>
            <MessageFolderHeader folder={folder} />
            <div className="search-messages-input">
              <label
                className="vads-u-margin-top--2p5"
                htmlFor="search-message-folder-input"
              >
                Search the Messages folder
              </label>
              <VaSearchInput label="search-message-folder-input" />
            </div>

            <div>{content}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default FolderListView;
