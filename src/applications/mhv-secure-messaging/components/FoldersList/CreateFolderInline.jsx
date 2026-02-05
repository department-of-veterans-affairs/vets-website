import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  VaAlert,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { datadogRum } from '@datadog/browser-rum';
import recordEvent from 'platform/monitoring/record-event';
import { Alerts } from '../../util/constants';

const CreateFolderInline = ({ folders, onConfirm, onFolderCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [nameWarning, setNameWarning] = useState('');
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const folderNameInput = useRef();
  const createFolderButtonRef = useRef();

  useEffect(
    () => {
      if (isExpanded && folderNameInput.current) {
        focusElement(
          folderNameInput.current.shadowRoot?.querySelector('input'),
        );
      }
    },
    [isExpanded],
  );

  useEffect(
    () => {
      if (nameWarning.length && folderNameInput.current) {
        focusElement(
          folderNameInput.current.shadowRoot?.querySelector('input'),
        );
      }
    },
    [nameWarning],
  );

  const handleCancel = useCallback(() => {
    setFolderName('');
    setNameWarning('');
    setIsExpanded(false);
    datadogRum.addAction('Create New Folder Inline Cancelled');
  }, []);

  const handleCreate = useCallback(
    async () => {
      const folderMatch = folders.filter(folder => folder.name === folderName);

      if (folderName === '' || folderName.match(/^[\s]+$/)) {
        setNameWarning(Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK);
      } else if (folderMatch.length > 0) {
        setNameWarning(Alerts.Folder.CREATE_FOLDER_ERROR_EXSISTING_NAME);
      } else if (folderName.match(/^[0-9a-zA-Z\s]+$/)) {
        try {
          await onConfirm(folderName);
          const createdFolderName = folderName;
          setFolderName('');
          setNameWarning('');
          setIsExpanded(false);
          setShowCreateSuccess(true);
          if (onFolderCreated) onFolderCreated(createdFolderName);
          focusElement(createFolderButtonRef.current);
        } catch (error) {
          // If creation fails, keep form open - error alert will be shown by action
        }
      } else {
        setNameWarning(Alerts.Folder.CREATE_FOLDER_ERROR_CHAR_TYPE);
      }
    },
    [folders, folderName, onConfirm, onFolderCreated],
  );

  const handleExpand = () => {
    setIsExpanded(true);
    recordEvent({
      event: 'cta-button-click',
      'button-type': 'primary',
      'button-click-label': 'Create new folder',
    });
    datadogRum.addAction('Create New Folder Inline Expanded');
  };

  if (!isExpanded) {
    return (
      <>
        {showCreateSuccess && (
          <VaAlert
            status="success"
            slim
            closeable
            closeBtnAriaLabel="Close notification"
            onCloseEvent={() => setShowCreateSuccess(false)}
            className="vads-u-margin-bottom--2"
            role="status"
            data-testid="create-folder-success-alert"
          >
            <p className="vads-u-margin-y--0">
              {Alerts.Folder.CREATE_FOLDER_SUCCESS}
            </p>
          </VaAlert>
        )}
        <va-button
          ref={createFolderButtonRef}
          onClick={handleExpand}
          text={Alerts.Folder.CREATE_FOLDER_MODAL_HEADER}
          data-testid="create-new-folder"
          data-dd-action-name="Create New Folder Button"
        />
      </>
    );
  }

  return (
    <div
      className="vads-u-margin-top--2 vads-u-margin-left--0p5 vads-u-border-left--5px vads-u-border-color--primary vads-u-padding-left--2"
      data-testid="create-folder-inline"
    >
      <VaTextInput
        data-dd-privacy="mask"
        ref={folderNameInput}
        label={Alerts.Folder.CREATE_FOLDER_MODAL_LABEL}
        className="input"
        width="2xl"
        value={folderName}
        onInput={e => {
          setFolderName(e.target.value);
          setNameWarning(
            e.target.value ? '' : Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK,
          );
        }}
        maxlength="50"
        error={nameWarning}
        name="folder-name"
        data-testid="folder-name"
        data-dd-action-name="Create Folder Inline Input Field"
        charcount
      />
      <div className="vads-u-margin-top--2">
        <va-button
          text="Create"
          onClick={handleCreate}
          data-testid="create-folder-button"
          data-dd-action-name="Confirm Create Folder Inline Button"
        />
        <va-button
          class="vads-u-margin-left--1"
          secondary
          text="Cancel"
          onClick={handleCancel}
          data-testid="cancel-folder-button"
          data-dd-action-name="Cancel Create Folder Inline Button"
        />
      </div>
    </div>
  );
};

CreateFolderInline.propTypes = {
  folders: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onFolderCreated: PropTypes.func,
};

CreateFolderInline.defaultProps = {
  onFolderCreated: null,
};

export default CreateFolderInline;
