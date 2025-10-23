import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import PropTypes from 'prop-types';
import { navigateToFoldersPage } from '../util/helpers';
import { delFolder, getFolders, renameFolder } from '../actions/folders';
import { closeAlert } from '../actions/alerts';
import * as Constants from '../util/constants';

const ManageFolderButtons = props => {
  const { ErrorMessages, Alerts } = Constants;
  const dispatch = useDispatch();
  const history = useHistory();
  const { folder } = props;
  const folders = useSelector(state => state.sm.folders.folderList);
  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const threads = useSelector(state => state.sm.threads);
  const [isEmptyWarning, setIsEmptyWarning] = useState(false);
  const [nameWarning, setNameWarning] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const folderNameInput = useRef();
  const renameModalReference = useRef(null);
  const removeButton = useRef(null);
  const emptyFolderConfirmBtn = useRef(null);
  const removeFolderRef = useRef(null);

  useEffect(() => {
    if (!folders) {
      dispatch(getFolders());
    }
  }, []);

  useEffect(
    () => {
      if (alertStatus) {
        renameModalReference.current?.focus();
      }
    },
    [alertStatus],
  );

  useEffect(
    () => {
      if (nameWarning.length)
        focusElement(
          folderNameInput.current.shadowRoot?.querySelector('input'),
        );
    },
    [nameWarning],
  );

  const openDelModal = () => {
    if (alertStatus) dispatch(closeAlert());
    if (threads.threadList.length > 0) {
      setIsEmptyWarning(true);
    } else {
      setIsEmptyWarning(false);
      setDeleteModal(true);
    }
  };

  const closeDelModal = () => {
    setDeleteModal(false);
    datadogRum.addAction('Remove Folder Modal Closed');
  };

  const confirmDelFolder = () => {
    closeDelModal();
    dispatch(delFolder(folder.folderId)).then(
      dispatch(getFolders()).then(navigateToFoldersPage(history)),
    );
  };

  const openRenameModal = () => {
    if (alertStatus) dispatch(closeAlert());
    setRenameModal(true);
  };

  const closeRenameModal = async () => {
    setFolderName('');
    setNameWarning('');
    await setRenameModal(false);
    focusElement(renameModalReference.current);
    datadogRum.addAction('Edit Folder Name Modal Closed');
  };

  const confirmRenameFolder = async () => {
    const folderMatch = folders.filter(
      testFolder => testFolder.name === folderName,
    );
    await setNameWarning(''); // Clear any previous warnings, so that the warning state can be updated and refocuses back to input if on repeat Save clicks.
    if (folderName === '' || folderName.match(/^[\s]+$/)) {
      setNameWarning(ErrorMessages.ManageFolders.FOLDER_NAME_REQUIRED);
    } else if (folderMatch.length > 0) {
      setNameWarning(ErrorMessages.ManageFolders.FOLDER_NAME_EXISTS);
    } else if (folderName.match(/^[0-9a-zA-Z\s]+$/)) {
      await dispatch(renameFolder(folder.folderId, folderName));
      closeRenameModal();
    } else {
      setNameWarning(
        ErrorMessages.ManageFolders.FOLDER_NAME_INVALID_CHARACTERS,
      );
    }
  };

  return (
    <>
      {folder.folderId > 0 && (
        <div
          className="            
            vads-u-display--flex
            vads-u-flex-direction--column
            mobile-lg:vads-u-flex-direction--row
            mobile-lg:vads-u-align-content--flex-start
          "
        >
          {/* TODO add GA event for both buttons */}
          <button
            type="button"
            className="usa-button-secondary"
            data-testid="edit-folder-button"
            onClick={openRenameModal}
            ref={renameModalReference}
            data-dd-action-name="Edit Folder Name Button"
          >
            Edit folder name
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            data-testid="remove-folder-button"
            onClick={openDelModal}
            data-dd-action-name="Remove Folder Button"
            ref={removeFolderRef}
          >
            Remove folder
          </button>
        </div>
      )}
      {isEmptyWarning && (
        <VaModal
          className="modal"
          data-testid="error-folder-not-empty"
          data-dd-action-name="Empty This Folder Modal"
          visible={isEmptyWarning}
          large
          modalTitle={Alerts.Folder.DELETE_FOLDER_ERROR_NOT_EMPTY_HEADER}
          onCloseEvent={() => {
            setIsEmptyWarning(false);
            focusElement(removeFolderRef.current);
            datadogRum.addAction('Empty This Folder Modal Closed');
          }}
          status="warning"
        >
          <p>{Alerts.Folder.DELETE_FOLDER_ERROR_NOT_EMPTY_BODY}</p>
          <va-button
            ref={emptyFolderConfirmBtn}
            text="Ok"
            onClick={() => {
              setIsEmptyWarning(false);
              focusElement(removeFolderRef.current);
            }}
            data-dd-action-name="OK Button Empty This Folder Modal"
          />
        </VaModal>
      )}
      {!isEmptyWarning && (
        <VaModal
          className="modal"
          data-testid="remove-this-folder"
          visible={deleteModal}
          large
          modalTitle={Alerts.Folder.DELETE_FOLDER_CONFIRM_HEADER}
          onCloseEvent={closeDelModal}
          status="warning"
          data-dd-action-name="Remove Folder Modal"
        >
          <p>{Alerts.Folder.DELETE_FOLDER_CONFIRM_BODY}</p>
          <va-button
            class="vads-u-margin-top--1"
            ref={removeButton}
            text="Yes, remove this folder"
            onClick={confirmDelFolder}
            data-dd-action-name="Confirm Remove Folder Button"
            data-testid="confirm-remove-folder"
          />
          <va-button
            class="vads-u-margin-top--1"
            secondary
            text="No, keep this folder"
            onClick={closeDelModal}
            data-dd-action-name="Cancel Remove Folder Button"
            data-testid="cancel-remove-folder"
          />
        </VaModal>
      )}
      <VaModal
        className="modal"
        data-testid="rename-folder-modal"
        visible={renameModal}
        large
        modalTitle={`Editing: ${folder.name}`}
        onCloseEvent={closeRenameModal}
        data-dd-action-name="Edit Folder Name Modal"
      >
        <VaTextInput
          data-dd-privacy="mask"
          ref={folderNameInput}
          label={Alerts.Folder.CREATE_FOLDER_MODAL_LABEL}
          value={folderName}
          className="input"
          error={nameWarning}
          onInput={e => {
            setFolderName(e.target.value);
            setNameWarning(e.target.value ? '' : 'Folder name cannot be blank');
          }}
          maxlength="50"
          name="new-folder-name"
          data-dd-action-name="Edit Folder Name Input Field"
          charcount
          width="2xl"
        />
        <va-button
          class="vads-u-margin-top--1"
          text="Save"
          onClick={confirmRenameFolder}
          data-dd-action-name="Save Edit Folder Name Button"
        />
        <va-button
          class="vads-u-margin-top--1"
          secondary="true"
          text="Cancel"
          onClick={closeRenameModal}
          data-dd-action-name="Cancel Edit Folder Name Button"
        />
      </VaModal>
    </>
  );
};

ManageFolderButtons.propTypes = {
  folder: PropTypes.object,
};

export default ManageFolderButtons;
