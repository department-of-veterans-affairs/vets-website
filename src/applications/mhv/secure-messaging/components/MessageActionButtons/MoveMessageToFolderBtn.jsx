import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch } from 'react-redux';
import { moveMessageToFolder } from '../../actions';

const MoveMessageToFolderBtn = props => {
  const { id, allFolders } = props;
  const dispatch = useDispatch();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(
    () => {
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
    if (selectedFolder !== null) {
      dispatch(moveMessageToFolder(id, selectedFolder));
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
    </>
  );
};

MoveMessageToFolderBtn.propTypes = {
  allFolders: PropTypes.object,
  id: PropTypes.number,
};

export default MoveMessageToFolderBtn;
