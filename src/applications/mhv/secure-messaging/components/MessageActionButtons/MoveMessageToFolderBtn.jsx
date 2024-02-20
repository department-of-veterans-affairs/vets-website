import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { moveMessageThread } from '../../actions/messages';
import { getFolders, newFolder } from '../../actions/folders';
import { navigateToFolderByFolderId } from '../../util/helpers';
import * as Constants from '../../util/constants';
import { addAlert } from '../../actions/alerts';
import CreateFolderModal from '../Modals/CreateFolderModal';
import { focusOnErrorField } from '../../util/formHelpers';

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
      focusOnErrorField();
    } else {
      if (selectedFolder === 'newFolder') {
        closeModal();
        setIsCreateNewModalVisible(true);
      } else if (selectedFolder !== null) {
        dispatch(moveMessageThread(threadId, selectedFolder)).then(() => {
          navigateToFolderByFolderId(
            activeFolder
              ? activeFolder.folderId
              : Constants.DefaultFolders.INBOX.id,
            history,
          );
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
          large
          modalTitle="Move to:"
          onCloseEvent={closeModal}
          visible={isMoveModalVisible}
          data-dd-action-name="Move To Modal Closed"
        >
          <p>
            This conversation will be moved. Any replies to this message will
            appear in your inbox
          </p>
          <VaRadio
            className="form-radio-buttons"
            required
            enable-analytics
            error={folderInputError}
            onVaValueChange={handleOnChangeFolder}
            data-dd-action-name="Select Move to Radio Button"
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
                data-dd-action-name="Select Move to Radio Button"
              />
            </>
          </VaRadio>
          <p /> {/* to create extra margin between radio and action buttons */}
          {/* For creating a new folder and moving the thread */}
          <va-button
            text="Confirm"
            onClick={handleConfirmMoveFolderTo}
            data-dd-action-name="Confirm Move to Button"
          />
          <va-button
            secondary
            text="Cancel"
            onClick={closeModal}
            data-dd-action-name="Cancel Move to Button"
          />
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
          type="button"
          className="usa-button-secondary small-screen:vads-u-flex--3"
          style={{ minWidth: '100px' }}
          onClick={openModal}
        >
          <i
            className="fas fa-folder vads-u-margin-right--0p5"
            aria-hidden="true"
          />
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
