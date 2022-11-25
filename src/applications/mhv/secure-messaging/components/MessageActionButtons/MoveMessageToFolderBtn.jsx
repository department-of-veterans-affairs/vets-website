import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { moveMessage } from '../../actions/messages';
import { getFolders, newFolder } from '../../actions/folders';

const MoveMessageToFolderBtn = props => {
  const { messageId, allFolders } = props;
  const dispatch = useDispatch();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [nameWarning, setNameWarning] = useState('');
  const [folderName, setFolderName] = useState('');
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
                allFolders.map(folder => (
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
                      {folder.name}
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

  const MoveMessageToNewFolder = () => {
    let folderMatch = null;

    const closeNewModal = () => {
      setFolderName('');
      setNameWarning('');
      setIsNewModalVisible(false);
    };

    const confirmNewFolder = () => {
      folderMatch = null;
      folderMatch = folders.filter(
        folderToMatch => folderToMatch.name === folderName,
      );
      if (folderName === '' || folderName.match(/^[\s]+$/)) {
        setNameWarning('Folder name cannot be blank');
      } else if (folderMatch.length > 0) {
        setNameWarning('Folder name alreeady in use. Please use another name.');
      } else if (folderName.match(/^[0-9a-zA-Z\s]+$/)) {
        dispatch(newFolder(folderName))
          .then(createdFolder =>
            dispatch(moveMessage(messageId, createdFolder.folderId)),
          )
          .finally(() => closeNewModal());
      } else {
        setNameWarning(
          'Folder name can only contain letters, numbers, and spaces.',
        );
      }
    };

    return (
      <>
        <VaModal
          className="modal"
          visible={isNewModalVisible}
          large="true"
          modalTitle="Create new folder"
          onCloseEvent={closeNewModal}
        >
          <VaTextInput
            className="input"
            value={folderName}
            onInput={e => setFolderName(e.target.value)}
            maxlength="50"
            error={nameWarning}
            name="folder-name"
            label="Please enter your folder name"
          />
          <va-button text="Confirm" onClick={confirmNewFolder} />
          <va-button secondary="true" text="Cancel" onClick={closeNewModal} />
        </VaModal>
      </>
    );
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
      {isNewModalVisible ? MoveMessageToNewFolder() : null}
    </>
  );
};

MoveMessageToFolderBtn.propTypes = {
  allFolders: PropTypes.array,
  messageId: PropTypes.number,
};

export default MoveMessageToFolderBtn;
