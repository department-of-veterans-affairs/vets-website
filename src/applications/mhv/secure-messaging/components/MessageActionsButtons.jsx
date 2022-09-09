import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFolders, moveMessageToFolder } from '../actions';

const MessageActionButtons = props => {
  const dispatch = useDispatch();
  const { folders } = useSelector(state => state?.folders);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(
    () => {
      const abortCont = new AbortController();
      dispatch(getAllFolders(), { abort: abortCont.signal });
      return () => abortCont.abort();
    },
    [dispatch, isModalVisible],
  );

  const openMoveModal = () => {
    setIsModalVisible(true);
  };

  const closeMoveModal = () => {
    setIsModalVisible(false);
  };

  const handleOnChangeFolder = e => {
    setSelectedFolder(e.target.value);
  };

  const handleConfirmMoveFolderTo = () => {
    if (selectedFolder !== null) {
      dispatch(moveMessageToFolder(props.id, selectedFolder));
    }
    closeMoveModal();
  };

  const moveToFolderModal = () => {
    return (
      <div className="message-actions-buttons-modal">
        <VaModal
          id="move-to-modal"
          large
          modalTitle="Move to:"
          onCloseEvent={closeMoveModal}
          onPrimaryButtonClick={handleConfirmMoveFolderTo}
          onSecondaryButtonClick={closeMoveModal}
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
              {folders.folder.map(folder => (
                <div className="radio-button" key={folder.name}>
                  <input
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
          </div>
        </VaModal>
      </div>
    );
  };

  return (
    <div className="message-action-buttons vads-l-row vads-u-justify-content--space-around">
      <button type="button" className="message-action-button">
        <i className="fas fa-print" />
        <span className="message-action-button-text">Print</span>
      </button>

      <button type="button" className="message-action-button">
        <i className="fas fa-trash-alt" />
        <span className="message-action-button-text">Delete</span>
      </button>

      <button
        type="button"
        className="message-action-button"
        onClick={openMoveModal}
      >
        <i className="fas fa-folder" />
        <span className="message-action-button-text">Move</span>
      </button>
      {isModalVisible ? moveToFolderModal() : null}

      <button type="button" className="message-action-button">
        <i className="fas fa-reply" />
        <span className="message-action-button-text">Reply</span>
      </button>
    </div>
  );
};

MessageActionButtons.propTypes = {
  id: PropTypes.number,
};

export default MessageActionButtons;
