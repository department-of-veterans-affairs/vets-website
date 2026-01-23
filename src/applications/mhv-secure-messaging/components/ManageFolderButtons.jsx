import {
  VaAccordion,
  VaAccordionItem,
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
  const folderNameInput = useRef();
  const editFolderButtonRef = useRef(null);
  const editAccordionRef = useRef(null);
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

  const handleAccordionToggle = ({ target }) => {
    if (alertStatus) dispatch(closeAlert());
    const isOpen = target?.getAttribute('open') === 'true';
    if (isOpen) {
      // Expanding - pre-fill with current folder name
      setFolderName(folder.name);
      setIsEditExpanded(true);
      recordEvent({
        event: 'cta-button-click',
        'button-type': 'secondary',
        'button-click-label': 'Edit folder name',
      });
      datadogRum.addAction('Edit Folder Name Expanded');
    } else {
      // Collapsing - reset state
      setFolderName('');
      setNameWarning('');
      setIsEditExpanded(false);
      datadogRum.addAction('Edit Folder Name Collapsed');
    }
  };

  const cancelEdit = useCallback(() => {
    setFolderName('');
    setNameWarning('');
    setIsEditExpanded(false);
    // Close accordion and return focus
    if (editAccordionRef.current) {
      editAccordionRef.current.removeAttribute('open');
    }
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
        await dispatch(renameFolder(folder.folderId, folderName));
        setIsEditExpanded(false);
        setFolderName('');
        setNameWarning('');
        // Close accordion after successful save
        if (editAccordionRef.current) {
          editAccordionRef.current.removeAttribute('open');
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
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            {/* Edit folder name accordion */}
            <VaAccordion
              bordered
              open-single
              onAccordionItemToggled={handleAccordionToggle}
              data-testid="edit-folder-accordion"
            >
              <VaAccordionItem
                header="Edit folder name"
                bordered
                ref={editAccordionRef}
                data-testid="edit-folder-button"
                data-dd-action-name="Edit Folder Name Accordion"
                level={3}
              >
                <VaTextInput
                  data-dd-privacy="mask"
                  ref={folderNameInput}
                  label={Alerts.Folder.CREATE_FOLDER_MODAL_LABEL}
                  value={folderName}
                  className="input"
                  width="2xl"
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
                  hint="50 characters allowed"
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
              </VaAccordionItem>
            </VaAccordion>

            {/* Remove folder button - red destructive style */}
            <button
              type="button"
              className="usa-button-secondary vads-u-margin-top--1 vads-u-width--full vads-u-color--secondary-dark"
              style={{
                borderColor: '#b50909',
                color: '#b50909',
              }}
              data-testid="remove-folder-button"
              onClick={openDelModal}
              data-dd-action-name="Remove Folder Button"
              ref={removeFolderRef}
            >
              Remove folder
            </button>
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
