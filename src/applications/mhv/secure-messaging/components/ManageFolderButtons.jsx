import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { navigateToFoldersPage } from '../util/helpers';
import { delFolder, getFolders, renameFolder } from '../actions/folders';

const ManageFolderButtons = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const [folderId, setFolderId] = useState(null);
  const folders = useSelector(state => state.sm.folders.folderList);
  const messages = useSelector(state => state.sm.messages?.messageList);
  const folder = useSelector(state => state.sm.folders.folder);
  const [isEmptyWarning, setIsEmptyWarning] = useState(false);
  const [nameWarning, setNameWarning] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  let folderMatch = null;

  useEffect(
    () => {
      if (location.pathname.includes('/folder')) {
        setFolderId(params.folderId);
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
    setDeleteModal(true);
  };

  const closeDelModal = () => {
    setDeleteModal(false);
  };

  const confirmDelFolder = () => {
    closeDelModal();
    dispatch(delFolder(folderId)).then(
      dispatch(getFolders()).then(navigateToFoldersPage(history)),
    );
  };

  const openRenameModal = () => {
    setRenameModal(true);
  };

  const closeRenameModal = () => {
    setFolderName('');
    setNameWarning('');
    setRenameModal(false);
  };

  const confirmRenameFolder = () => {
    folderMatch = null;
    folderMatch = folders.filter(testFolder => testFolder.name === folderName);
    if (folderName === '' || folderName.match(/^[\s]+$/)) {
      setNameWarning('Folder name cannot be blank');
    } else if (folderMatch.length > 0) {
      setNameWarning('Folder name alreeady in use. Please use another name.');
    } else if (folderName.match(/^[0-9a-zA-Z\s]+$/)) {
      closeRenameModal();
      dispatch(renameFolder(folderId, folderName));
    } else {
      setNameWarning(
        'Folder name can only contain letters, numbers, and spaces.',
      );
    }
  };

  return (
    <>
      {folder.folderId > 0 && (
        // This container needs to be updated to USWDS v3 when the project updates. These buttons are to become a button group, segmented
        <div className="manage-folder-container">
          <button
            type="button"
            className="left-button usa-button-secondary"
            onClick={openRenameModal}
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
      {isEmptyWarning && (
        <VaModal
          className="modal"
          visible={deleteModal}
          large="true"
          modalTitle="Empty this folder before removing it from the list."
          onCloseEvent={closeDelModal}
          status="warning"
        >
          <p>
            Before this folder can be removed, all of the messages in it must be
            moved to another folder, such as Trash, Messages, or a different
            custom folder.
          </p>
          <va-button text="Ok" onClick={closeDelModal} />
        </VaModal>
      )}
      {!isEmptyWarning && (
        <VaModal
          className="modal"
          visible={deleteModal}
          large="true"
          modalTitle="Are you sure you want to remove this folder?"
          onCloseEvent={closeDelModal}
        >
          <p>This action cannot be undone</p>
          <va-button text="Remove" onClick={confirmDelFolder} />
          <va-button secondary="true" text="Cancel" onClick={closeDelModal} />
        </VaModal>
      )}
      <VaModal
        className="modal"
        visible={renameModal}
        large="true"
        modalTitle={`Editing: ${folder.name}`}
        onCloseEvent={closeRenameModal}
      >
        <p className="no-margin">
          <strong>Edit the folder name</strong>
        </p>
        <p className="no-margin">(50 characters maximum)</p>
        <VaTextInput
          value={folderName}
          className="input"
          error={nameWarning}
          onInput={e => setFolderName(e.target.value)}
          maxlength="50"
          name="new-folder-name"
        />
        <va-button text="Save" onClick={confirmRenameFolder} />
        <va-button secondary="true" text="Cancel" onClick={closeRenameModal} />
      </VaModal>
    </>
  );
};

export default ManageFolderButtons;
