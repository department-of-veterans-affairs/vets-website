import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { moveMessage } from '../../actions/messages';
import { getFolders, newFolder } from '../../actions/folders';
import * as Constants from '../../util/constants';
import CreateFolderModal from '../Modals/CreateFolderModal';

const MoveMessageToFolderBtn = props => {
  const { messageId, allFolders } = props;
  const dispatch = useDispatch();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const folders = useSelector(state => state.sm.folders.folderList);

  useEffect(
    () => {
      dispatch(getFolders);
      const abortCont = new AbortController();
      return () => abortCont.abort();
    },
    [dispatch],
  );

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOnChangeFolder = e => {
    setSelectedFolder(e.target.value);
  };

  const handleConfirmMoveFolderTo = () => {
    if (selectedFolder === 'newFolder') {
      setIsNewModalVisible(true);
    } else if (selectedFolder !== null) {
      dispatch(moveMessage(messageId, selectedFolder));
    }
    closeModal();
  };

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
          onPrimaryButtonClick={handleConfirmMoveFolderTo}
          onSecondaryButtonClick={closeModal}
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          visible={isModalVisible}
        >
          <div className="modal-body">
            <p>
              This conversation will be moved. Any replies to this message will
              appear in your inbox
            </p>
            <div className="form-radio-buttons">
              {allFolders &&
                allFolders
                  .filter(
                    folder =>
                      folder.id !== Constants.DefaultFolders.DRAFTS.id &&
                      folder.id !== Constants.DefaultFolders.SENT.id,
                  )
                  .map(folder => (
                    <div className="radio-button" key={folder.name}>
                      <input
                        data-testid="folder-list-radio-button"
                        type="radio"
                        autoComplete="false"
                        id={`radiobutton-${folder.name}`}
                        name="defaultName"
                        value={folder.id}
                        onChange={handleOnChangeFolder}
                      />
                      <label
                        name="defaultName-0-label"
                        htmlFor={`radiobutton-${folder.name}`}
                      >
                        {/* checking if the folder is the trash folder, as the name on the backend is 'Deleted' instead of 'Trash'. */}
                        {folder.id === Constants.DefaultFolders.DELETED.id
                          ? 'Trash'
                          : folder.name}
                      </label>
                    </div>
                  ))}
              <div className="radio-button">
                <input
                  data-testid="folder-list-radio-button"
                  type="radio"
                  autoComplete="false"
                  id="radiobutton-newFolder"
                  name="defaultName"
                  value="newFolder"
                  onChange={handleOnChangeFolder}
                />
                <label
                  name="defaultName-0-label"
                  htmlFor="radiobutton-newFolder"
                >
                  Create new folder
                </label>
              </div>
            </div>
            <button
              style={{ display: 'none' }}
              type="button"
              onClick={closeModal}
              aria-hidden="true"
              data-testid="hidden-button-close-modal"
            >
              Cancel
            </button>
          </div>
        </VaModal>
      </div>
    );
  };

  const confirmCreateFolder = (folderName, closeNewModal) => {
    dispatch(newFolder(folderName))
      .then(createdFolder =>
        dispatch(moveMessage(messageId, createdFolder.folderId)),
      )
      .finally(() => closeNewModal());
  };

  return (
    <>
      <button
        type="button"
        className="message-action-button"
        onClick={openModal}
      >
        <i className="fas fa-folder" aria-hidden="true" />
        <span
          className="message-action-button-text"
          data-testid="move-button-text"
        >
          Move
        </span>
      </button>
      {isModalVisible ? moveToFolderModal() : null}
      <CreateFolderModal
        isModalVisible={isNewModalVisible}
        setIsModalVisible={setIsNewModalVisible}
        onConfirm={confirmCreateFolder}
        folders={folders}
      />
    </>
  );
};

MoveMessageToFolderBtn.propTypes = {
  allFolders: PropTypes.array,
  messageId: PropTypes.number,
};

export default MoveMessageToFolderBtn;
