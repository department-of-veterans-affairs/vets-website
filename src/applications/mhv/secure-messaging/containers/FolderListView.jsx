import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { clearMessage, getMessages } from '../actions/messages';
import { DefaultFolders as Folders, Alerts } from '../util/constants';
import useInterval from '../hooks/use-interval';
import MessageList from '../components/MessageList/MessageList';
import FolderHeader from '../components/MessageList/FolderHeader';
import { clearFolder, retrieveFolder } from '../actions/folders';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';

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
      // clear out folder reducer to prevent from previous folder data flashing
      // when navigating between folders
      dispatch(clearFolder());
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
        dispatch(retrieveFolder(folderId)).then(() => {
          dispatch(getMessages(folderId));
        });
      }
      // clear out message reducer to prevent from previous message data flashing
      // when navigating between messages
      dispatch(clearMessage());
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
    if (folderId) {
      dispatch(getMessages(folderId, true));
    }
  }, 60000);

  const loadingIndicator = () => {
    return (
      <va-loading-indicator
        message="Loading your secure messages..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  const content = () => {
    if (messages === undefined) {
      return loadingIndicator();
    }
    if (messages.length === 0) {
      return (
        <>
          <div className="vads-u-padding-y--1p5 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
            Displaying 0 of 0 messages
          </div>
          <div className="vads-u-margin-top--3 vads-u-margin-bottom--4">
            <va-alert
              background-only="true"
              status="info"
              className="vads-u-margin-bottom--1 va-alert"
            >
              <p className="vads-u-margin-y--0">{Alerts.Message.NO_MESSAGES}</p>
            </va-alert>
          </div>
        </>
      );
    }
    if (error) {
      return (
        <va-alert status="error" visible>
          <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
          <p>
            You can’t view your secure messages because something went wrong on
            our end. Please check back soon.
          </p>
        </va-alert>
      );
    }
    if (messages.length > 0) {
      return <MessageList messages={messages} folder={folder} />;
    }
    return '';
  };

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="main-content">
        <AlertBackgroundBox closeable />
        {folder?.folderId === undefined && loadingIndicator()}
        {folder?.folderId !== undefined && (
          <>
            <FolderHeader folder={folder} />
            {content()}
          </>
        )}
      </div>
    </div>
  );
};

export default FolderListView;
