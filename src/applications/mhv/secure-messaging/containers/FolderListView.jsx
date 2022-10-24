import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { getMessages } from '../actions/messages';
import { DefaultFolders as Folders } from '../util/constants';
import useInterval from '../hooks/use-interval';
import InboxListView from '../components/MessageList/InboxListView';
import FolderHeader from '../components/MessageList/FolderHeader';
import { retrieveFolder } from '../actions/folders';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';
import ManageFolderButtons from '../components/ManageFolderButtons';

const FolderListView = () => {
  const dispatch = useDispatch();
  const [folderId, setFolderId] = useState(null);
  const error = null;
  const messages = useSelector(state => state.sm.messages?.messageList);
  const folder = useSelector(state => state.sm.folders.folder);
  const location = useLocation();
  const params = useParams();

  useEffect(
    () => {
      if (location.pathname.includes('/folder')) {
        setFolderId(params.folderId);
      } else {
        switch (location.pathname) {
          case '/':
            setFolderId(Folders.INBOX.id);
            break;
          case '/sent':
            setFolderId(Folders.SENT.id);
            break;
          case '/drafts':
            setFolderId(Folders.DRAFTS.id);
            break;
          case '/trash':
            setFolderId(Folders.DELETED.id);
            break;
          default:
            break;
        }
      }
    },
    [dispatch, location.pathname, params.folderId],
  );

  useEffect(
    () => {
      if (folderId) {
        dispatch(retrieveFolder(folderId));
        dispatch(getMessages(folderId));
      }
    },
    [folderId, dispatch],
  );

  // clear out alerts if user navigates away from this component
  useEffect(
    () => {
      return () => {
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [location.pathname, dispatch],
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
        <InboxListView messages={messages} folder={folder} />
      </>
    );
  }

  return (
    <div className="vads-l-grid-container">
      <div className="main-content">
        <AlertBackgroundBox closeable />
        {folder === undefined ? (
          <va-loading-indicator
            message="Loading your secure messages..."
            setFocus
          />
        ) : (
          <>
            <FolderHeader folder={folder} />
            <ManageFolderButtons />
            <div className="search-messages-input">
              <label
                className="vads-u-margin-top--2p5"
                htmlFor="search-message-folder-input"
              >
                Search the {folder.name} messages folder
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
