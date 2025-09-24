import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { datadogRum } from '@datadog/browser-rum';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { moveMessageThread } from '../../actions/messages';
import { getFolders, newFolder } from '../../actions/folders';
import { navigateToFolderByFolderId } from '../../util/helpers';
import * as Constants from '../../util/constants';
import { addAlert } from '../../actions/alerts';
import CreateFolderModal from '../Modals/CreateFolderModal';
import { focusOnErrorField } from '../../util/formHelpers';
import { getListOfThreads } from '../../actions/threads';

const MoveMessageToFolderBtn = props => {
  const {
    threadId,
    allFolders,
    isVisible,
    activeFolder,
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const threadSort = useSelector(state => state.sm.threads.threadSort);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const [folderInputError, setFolderInputError] = useState(null);
  const [updatedFoldersList, setUpdatedFolderList] = useState([]);

  useEffect(
    () => {
      dispatch(getFolders);
      const abortCont = new AbortController();
      return () => abortCont.abort();
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (folderInputError) {
        focusOnErrorField();
      }
    },
    [folderInputError],
  );

  const getDDRadioButtonLabel = folderId => {
    const sortRadioMap = {
      [Constants.DefaultFolders.INBOX.id]:
        Constants.DefaultFolders.INBOX.header,
      [Constants.DefaultFolders.DELETED.id]:
        Constants.DefaultFolders.DELETED.header,
    };
    return sortRadioMap[folderId] || 'Custom Folder';
  };

  const openModal = () => {
    setIsMoveModalVisible(true);
  };

  // for closing move modal
  const closeModal = () => {
    setIsMoveModalVisible(false);
    setSelectedFolder(null);
    setFolderInputError(null);
  };

  const handleOnChangeFolder = ({ detail }) => {
    setSelectedFolder(detail.value);
    if (detail.value !== null) {
      setFolderInputError(null);
    }
  };

  const handleConfirmMoveFolderTo = () => {
    if (selectedFolder === null) {
      setFolderInputError(
        Constants.ErrorMessages.MoveConversation.FOLDER_REQUIRED,
      );
    } else {
      if (selectedFolder === 'newFolder') {
        closeModal();
        setIsCreateNewModalVisible(true);
      } else if (selectedFolder !== null) {
        dispatch(moveMessageThread(threadId, selectedFolder)).then(() => {
          const redirectToFolderId = activeFolder
            ? activeFolder.folderId
            : Constants.DefaultFolders.INBOX.id;
          dispatch(
            getListOfThreads(
              redirectToFolderId,
              Constants.THREADS_PER_PAGE_DEFAULT,
              threadSort.page,
              threadSort.value,
              true,
            ),
          );
          navigateToFolderByFolderId(redirectToFolderId, history);
          dispatch(
            addAlert(
              Constants.ALERT_TYPE_SUCCESS,
              '',
              Constants.Alerts.Message.MOVE_MESSAGE_THREAD_SUCCESS,
            ),
          );
        });
      }
      closeModal();
    }
  };

  useEffect(
    () => {
      setUpdatedFolderList(
        allFolders.filter(
          folder =>
            folder.id !== activeFolder?.folderId &&
            folder.id !== Constants.DefaultFolders.DRAFTS.id &&
            folder.id !== Constants.DefaultFolders.SENT.id,
        ),
      );
    },
    [allFolders, activeFolder],
  );

  const moveToFolderModal = () => {
    return (
      <div
        className="message-actions-buttons-modal"
        data-testid="message-actions-buttons-modal"
      >
        <VaModal
          id="move-to-modal"
          data-testid="move-to-modal"
          modalTitle="Move conversation"
          onCloseEvent={() => {
            closeModal();
            datadogRum.addAction('Move Conversation Modal Closed');
          }}
          visible={isMoveModalVisible}
          data-dd-action-name="Move Conversation Modal"
        >
          <p>Any replies to this message will appear in your inbox.</p>
          <VaRadio
            className="form-radio-buttons"
            required
            enable-analytics
            error={folderInputError}
            onVaValueChange={handleOnChangeFolder}
            data-dd-action-name="Select Move to Radio Button"
            label="Select a folder"
            data-testid="select-folder-radio-group"
          >
            {updatedFoldersList &&
              updatedFoldersList.map((folder, i) => (
                <>
                  <VaRadioOption
                    checked={parseInt(selectedFolder, 10) === folder.id}
                    data-dd-privacy="mask"
                    data-testid={`radiobutton-${folder.name}`}
                    key={i}
                    id={`radiobutton-${folder.name}`}
                    // checking if the folder is the trash folder, as the name on the backend is 'Deleted' instead of 'Trash'
                    label={
                      folder.id === Constants.DefaultFolders.DELETED.id
                        ? Constants.DefaultFolders.DELETED.header
                        : folder.name
                    }
                    name="defaultName"
                    value={folder.id}
                    data-dd-action-name={`${getDDRadioButtonLabel(
                      selectedFolder,
                    )} Radio in Move Conversation Modal`}
                  />
                </>
              ))}
            <>
              <VaRadioOption
                data-testid="folder-list-radio-button"
                id="radiobutton-newFolder"
                label="Create new folder"
                name="defaultName"
                value="newFolder"
                checked={selectedFolder === 'newFolder'}
                data-dd-action-name="Create New Folder Radio in Move Conversation Modal"
              />
            </>
          </VaRadio>
          <p /> {/* to create extra margin between radio and action buttons */}
          {/* For creating a new folder and moving the thread */}
          <div
            className="
              move-folder-modal-buttons
              vads-u-display--flex
              vads-u-flex-direction--column
              mobile-lg:vads-u-flex-direction--row
              "
          >
            <va-button
              text="Confirm"
              onClick={handleConfirmMoveFolderTo}
              data-dd-action-name="Confirm Move Conversation Button"
            />
            <va-button
              class="vads-u-margin-top--1 mobile-lg:vads-u-margin-top--0"
              secondary
              text="Cancel"
              onClick={closeModal}
              data-dd-action-name="Cancel Move Conversation Button"
            />
          </div>
        </VaModal>
      </div>
    );
  };

  const confirmCreateFolder = (folderName, closeNewModal) => {
    dispatch(newFolder(folderName))
      .then(createdFolder =>
        dispatch(moveMessageThread(threadId, createdFolder.folderId)),
      )
      .finally(() => closeNewModal());
  };

  return (
    isVisible && (
      <>
        <button
          id="move-button"
          type="button"
          className="usa-button-secondary
            mobile-lg:vads-u-flex--3
            vads-u-display--flex
            vads-u-flex-direction--row
            vads-u-justify-content--center
            vads-u-align-items--center
            vads-u-padding-x--2
            message-action-button
            vads-u-margin--0
            vads-u-margin-top--1
            mobile-lg:vads-u-margin-top--0
            mobile-lg:vads-u-margin-left--1"
          onClick={openModal}
          data-dd-action-name="Move Button"
        >
          <div className="vads-u-margin-right--0p5">
            <va-icon icon="folder" aria-hidden="true" />
          </div>
          <span
            className="message-action-button-text"
            data-testid="move-button-text"
          >
            Move
          </span>
        </button>
        {isMoveModalVisible ? moveToFolderModal() : null}

        {isCreateNewModalVisible && (
          <CreateFolderModal
            isCreateNewModalVisible={isCreateNewModalVisible}
            setIsCreateNewModalVisible={setIsCreateNewModalVisible}
            onConfirm={confirmCreateFolder}
            folders={updatedFoldersList}
          />
        )}
      </>
    )
  );
};

MoveMessageToFolderBtn.propTypes = {
  activeFolder: PropTypes.object,
  allFolders: PropTypes.array,
  isCreateNewModalVisible: PropTypes.bool,
  isVisible: PropTypes.bool,
  setIsCreateNewModalVisible: PropTypes.func,
  threadId: PropTypes.number,
};

export default MoveMessageToFolderBtn;
