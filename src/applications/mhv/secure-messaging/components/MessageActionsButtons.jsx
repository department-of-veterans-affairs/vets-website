import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFolders, moveMessageToFolder } from '../actions';
import { deleteMessage } from '../actions/messages';
import { navigateToFolderByFolderId } from '../util/helpers';
import DeleteMessageModal from './Modals/DeleteMessageModal';
import * as Constants from '../util/constants';

const MessageActionButtons = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { folders } = useSelector(state => state?.folders);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const activeFolder = useSelector(state => state.sm.folders.folder);

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

  const handleDeleteMessageConfirm = () => {
    setIsDeleteVisible(false);
    dispatch(deleteMessage(props.id)).then(() => {
      navigateToFolderByFolderId(
        activeFolder
          ? activeFolder.folderId
          : Constants.DefaultFolders.DELETED.id,
        history,
      );
    });
  };

  const deleteMessageModal = () => {
    return (
      <DeleteMessageModal
        id={props.id}
        visible={isDeleteVisible}
        onClose={() => {
          setIsDeleteVisible(false);
        }}
        onDelete={() => {
          handleDeleteMessageConfirm();
        }}
      />
    );
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
        <i className="fas fa-print" aria-hidden="true" />
        <span className="message-action-button-text">Print</span>
      </button>

      {activeFolder?.folderId !== Constants.DefaultFolders.SENT.id &&
        activeFolder?.folderId !== Constants.DefaultFolders.DELETED.id && (
          <button
            type="button"
            className="message-action-button"
            onClick={() => {
              setIsDeleteVisible(true);
            }}
          >
            <i className="fas fa-trash-alt" aria-hidden />
            <span className="message-action-button-text">Trash</span>
          </button>
        )}

      {isDeleteVisible && deleteMessageModal()}

      <button
        type="button"
        className="message-action-button"
        onClick={openMoveModal}
      >
        <i className="fas fa-folder" aria-hidden />
        <span className="message-action-button-text">Move</span>
      </button>
      {isModalVisible ? moveToFolderModal() : null}

      <button
        type="button"
        className="message-action-button"
        onClick={props.onReply}
      >
        <i className="fas fa-reply" aria-hidden="true" />
        <span className="message-action-button-text">Reply</span>
      </button>
    </div>
  );
};

MessageActionButtons.propTypes = {
  id: PropTypes.number,
  onReply: PropTypes.func,
};

export default MessageActionButtons;
