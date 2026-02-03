import {
  VaAlert,
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
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
  const [isEditExpanded, setIsEditExpanded] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [showRenameSuccess, setShowRenameSuccess] = useState(false);
  const folderNameInput = useRef();
  const editFolderButtonRef = useRef(null);
  const removeButton = useRef(null);
  const emptyFolderConfirmBtn = useRef(null);
  const removeFolderRef = useRef(null);

  useEffect(() => {
    if (!folders) {
      dispatch(getFolders());
    }
  }, []);

  // Reset local state when navigating to a different folder
  useEffect(
    () => {
      setShowRenameSuccess(false);
      setIsEditExpanded(false);
      setFolderName('');
      setNameWarning('');
      setIsEmptyWarning(false);
      setDeleteModal(false);
    },
    [folder?.folderId],
  );

  useEffect(
    () => {
      if (alertStatus) {
        editFolderButtonRef.current?.focus();
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

  useEffect(
    () => {
      if (isEditExpanded && folder?.name) {
        setFolderName(folder.name);
      }
    },
    [isEditExpanded, folder?.name],
  );

  useEffect(
    () => {
      if (isEditExpanded && folderNameInput.current) {
        focusElement(
          folderNameInput.current.shadowRoot?.querySelector('input'),
        );
      }
    },
    [isEditExpanded],
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

  const openEditForm = () => {
    if (alertStatus) dispatch(closeAlert());
    setFolderName(folder.name);
    setIsEditExpanded(true);
    recordEvent({
      event: 'cta-button-click',
      'button-type': 'secondary',
      'button-click-label': 'Edit folder name',
    });
    datadogRum.addAction('Edit Folder Name Expanded');
  };

  const cancelEdit = useCallback(() => {
    setFolderName('');
    setNameWarning('');
    setIsEditExpanded(false);
    focusElement(editFolderButtonRef.current);
    datadogRum.addAction('Edit Folder Name Cancelled');
  }, []);

  const confirmRenameFolder = useCallback(
    async () => {
      const folderMatch = folders.filter(
        testFolder => testFolder.name === folderName,
      );
      await setNameWarning(''); // Clear any previous warnings, so that the warning state can be updated and refocuses back to input if on repeat Save clicks.
      if (folderName === '' || folderName.match(/^[\s]+$/)) {
        setNameWarning(ErrorMessages.ManageFolders.FOLDER_NAME_REQUIRED);
      } else if (folderMatch.length > 0) {
        setNameWarning(ErrorMessages.ManageFolders.FOLDER_NAME_EXISTS);
      } else if (folderName.match(/^[0-9a-zA-Z\s]+$/)) {
        try {
          // Pass suppressSuccessAlert=true to prevent global alert, we show inline alert instead
          await dispatch(renameFolder(folder.folderId, folderName, true));
          setIsEditExpanded(false);
          setFolderName('');
          setNameWarning('');
          setShowRenameSuccess(true);
          // Per accessibility guidance: leave focus on triggering control (Edit button)
          // The slim alert with role="status" will announce the success message
          focusElement(editFolderButtonRef.current);
        } catch (error) {
          // If rename fails, keep form open - global error alert will be shown by action
          // Error already logged to Datadog via sendDatadogError in renameFolder action
        }
      } else {
        setNameWarning(
          ErrorMessages.ManageFolders.FOLDER_NAME_INVALID_CHARACTERS,
        );
      }
    },
    [folders, folderName, folder.folderId, dispatch, ErrorMessages],
  );

  return (
    <>
      {folder.folderId > 0 && (
        <>
          <h2 className="vads-u-margin-top--3 vads-u-margin-bottom--2">
            Edit folder
          </h2>
          {showRenameSuccess && (
            <VaAlert
              status="success"
              slim
              closeable
              closeBtnAriaLabel="Close notification"
              onCloseEvent={() => setShowRenameSuccess(false)}
              className="vads-u-margin-bottom--2"
              role="status"
              data-testid="rename-success-alert"
            >
              <p className="vads-u-margin-y--0">
                {Alerts.Folder.RENAME_FOLDER_SUCCESS}
              </p>
            </VaAlert>
          )}
          <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-flex-wrap--wrap">
            {/* Edit folder name button */}
            <div className="vads-u-width--full medium-screen:vads-u-width--auto vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--0">
              <va-button
                ref={editFolderButtonRef}
                secondary
                full-width
                text="Edit folder name"
                onClick={openEditForm}
                data-dd-action-name="Edit Folder Name Button"
                data-testid="edit-folder-button"
              />
            </div>

            {/* Inline edit form - shown when expanded */}
            {isEditExpanded && (
              <div
                className="vads-u-margin-top--2 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0 vads-u-margin-left--0p5 vads-u-border-left--5px vads-u-border-color--primary vads-u-padding-left--2 vads-u-width--full medium-screen:vads-u-order--last"
                data-testid="edit-folder-form"
              >
                <VaTextInput
                  data-dd-privacy="mask"
                  data-testid="edit-folder-name-input"
                  ref={folderNameInput}
                  label={Alerts.Folder.CREATE_FOLDER_MODAL_LABEL}
                  value={folderName}
                  className="input"
                  error={nameWarning}
                  onInput={e => {
                    setFolderName(e.target.value);
                    setNameWarning(
                      e.target.value
                        ? ''
                        : ErrorMessages.ManageFolders.FOLDER_NAME_REQUIRED,
                    );
                  }}
                  maxlength="50"
                  name="new-folder-name"
                  data-dd-action-name="Edit Folder Name Input Field"
                  charcount
                />
                <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--2">
                  <va-button
                    text="Save"
                    onClick={confirmRenameFolder}
                    data-dd-action-name="Save Edit Folder Name Button"
                    data-testid="save-edit-folder-button"
                  />
                  <va-button
                    class="vads-u-margin-left--1"
                    secondary
                    text="Cancel"
                    onClick={cancelEdit}
                    data-dd-action-name="Cancel Edit Folder Name Button"
                    data-testid="cancel-edit-folder-button"
                  />
                </div>
              </div>
            )}

            {/* Remove folder button - red destructive style */}
            <div className="vads-u-width--full medium-screen:vads-u-width--auto medium-screen:vads-u-margin-left--1">
              <va-button
                ref={removeFolderRef}
                secondary
                full-width
                text="Remove folder"
                onClick={openDelModal}
                data-dd-action-name="Remove Folder Button"
                data-testid="remove-folder-button"
                class="sm-button-destructive"
              />
            </div>
          </div>
        </>
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
    </>
  );
};

ManageFolderButtons.propTypes = {
  folder: PropTypes.object,
};

export default ManageFolderButtons;
