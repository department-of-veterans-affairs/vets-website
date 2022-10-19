import {
  VaModal,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { getMessages } from '../actions/messages';
import { DefaultFolders as Folders } from '../util/constants';
import useInterval from '../hooks/use-interval';
import InboxListView from '../components/MessageList/InboxListView';
import FolderHeader from '../components/MessageList/FolderHeader';
import { retrieveFolder, delFolder, getFolders } from '../actions/folders';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';
import { navigateToFoldersPage } from '../util/helpers';

const FolderListView = () => {
  const dispatch = useDispatch();
  const [folderId, setFolderId] = useState(null);
  const error = null;
  const messages = useSelector(state => state.sm.messages?.messageList);
  const folder = useSelector(state => state.sm.folders.folder);
  const location = useLocation();
  const params = useParams();
  const history = useHistory();
  const [isEmptyWarning, setIsEmptyWarning] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const openDelModal = () => {
    if (messages.length > 0) {
      setIsEmptyWarning(true);
    } else {
      setIsEmptyWarning(false);
    }
    setIsModalVisible(true);
  };

  const closeDelModal = () => {
    setIsModalVisible(false);
  };

  const confirmDelFolder = () => {
    dispatch(delFolder(folderId));
    closeDelModal();
    dispatch(getFolders()).then(navigateToFoldersPage(history));
  };

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
            {folder.folderId > 0 && (
              // This container needs to be updated to USWDS v3 when the project updates. These buttons are to become a button group, segmented
              <div className="manage-folder-container">
                <button
                  type="button"
                  className="left-button usa-button-secondary"
                  onClick={function noRefCheck() {}}
                >
                  Edit folder name
                </button>
                <button
                  type="button"
                  className="right-button usa-button-secondary"
                  onClick={openDelModal}
                >
                  Remove folder
                </button>
              </div>
            )}
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
            {isEmptyWarning && (
              <VaModal
                className="modal"
                visible={isModalVisible}
                large="true"
                modalTitle="Empty this folder before removing it from the list."
                onCloseEvent={closeDelModal}
                status="warning"
              >
                <p>
                  Before this folder can be removed, all of the messages in it
                  must be moved to another folder, such as Trash, Messages, or a
                  different custom folder.
                </p>
                <va-button text="Ok" onClick={closeDelModal} />
              </VaModal>
            )}
            {!isEmptyWarning && (
              <VaModal
                className="modal"
                visible={isModalVisible}
                large="true"
                modalTitle="Are you sure you want to remove this folder?"
                onCloseEvent={closeDelModal}
              >
                <p>This action cannot be undone</p>
                <va-button text="Remove" onClick={confirmDelFolder} />
                <va-button
                  secondary="true"
                  text="Cancel"
                  onClick={closeDelModal}
                />
              </VaModal>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FolderListView;
