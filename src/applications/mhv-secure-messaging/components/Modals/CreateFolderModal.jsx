import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { Alerts } from '../../util/constants';

const CreateFolderModal = props => {
  const {
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
    onConfirm,
    folders,
  } = props;
  const [folderName, setFolderName] = useState('');
  const [nameWarning, setNameWarning] = useState('');
  const folderNameInput = useRef();

  useEffect(
    () => {
      if (nameWarning.length)
        focusElement(
          folderNameInput.current.shadowRoot?.querySelector('input'),
        );
    },
    [nameWarning],
  );

  const closeNewModal = useCallback(
    () => {
      setFolderName('');
      setNameWarning('');
      setIsCreateNewModalVisible(false);
    },
    [setFolderName, setNameWarning, setIsCreateNewModalVisible],
  );

  const confirmNewFolder = useCallback(
    () => {
      let folderMatch = null;
      folderMatch = folders.filter(folder => folder.name === folderName);
      if (folderName === '' || folderName.match(/^[\s]+$/)) {
        setNameWarning(Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK);
      } else if (folderMatch.length > 0) {
        setNameWarning(Alerts.Folder.CREATE_FOLDER_ERROR_EXSISTING_NAME);
      } else if (folderName.match(/^[0-9a-zA-Z\s]+$/)) {
        onConfirm(folderName, closeNewModal);
      } else {
        setNameWarning(Alerts.Folder.CREATE_FOLDER_ERROR_CHAR_TYPE);
      }
    },
    [folders, folderName, onConfirm, closeNewModal],
  );

  return (
    <VaModal
      className="modal"
      visible={isCreateNewModalVisible}
      large="true"
      modalTitle={Alerts.Folder.CREATE_FOLDER_MODAL_HEADER}
      onCloseEvent={closeNewModal}
      data-testid="create-folder-modal"
      data-dd-action-name="Create New Folder Modal Closed"
    >
      <VaTextInput
        data-dd-privacy="mask"
        ref={folderNameInput}
        label={Alerts.Folder.CREATE_FOLDER_MODAL_LABEL}
        className="input vads-u-margin--0"
        value={folderName}
        onInput={e => {
          setFolderName(e.target.value);
          setNameWarning(e.target.value ? '' : 'Folder name cannot be blank');
        }}
        maxlength="50"
        error={nameWarning}
        name="folder-name"
        data-testid="folder-name"
        data-dd-action-name="Create New Folder Modal Input Field"
        charcount
      />
      <va-button
        text="Create"
        onClick={confirmNewFolder}
        data-testid="create-folder-button"
        data-dd-action-name="Confirm Create New Folder Button"
      />
      <va-button
        secondary="true"
        text="Cancel"
        onClick={closeNewModal}
        data-testid="cancel-folder-button"
        data-dd-action-name="Cancel Create New Folder Button"
      />
    </VaModal>
  );
};

CreateFolderModal.propTypes = {
  folders: PropTypes.array.isRequired,
  isCreateNewModalVisible: PropTypes.bool.isRequired,
  setIsCreateNewModalVisible: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default CreateFolderModal;
