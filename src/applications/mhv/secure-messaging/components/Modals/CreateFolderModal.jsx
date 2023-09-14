import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { Alerts } from '../../util/constants';

const CreateFolderModal = props => {
  const { isModalVisible, setIsModalVisible, onConfirm, folders } = props;
  const [folderName, setFolderName] = useState('');
  const [nameWarning, setNameWarning] = useState('');
  const folderNameInput = useRef();
  let folderMatch = null;

  useEffect(
    () => {
      if (nameWarning.length)
        focusElement(folderNameInput.current.shadowRoot.querySelector('input'));
    },
    [nameWarning],
  );

  const closeNewModal = () => {
    setFolderName('');
    setNameWarning('');
    setIsModalVisible(false);
  };

  const confirmNewFolder = async () => {
    folderMatch = null;
    await setNameWarning('');
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
  };

  return (
    <VaModal
      className="modal"
      visible={isModalVisible}
      large="true"
      modalTitle={Alerts.Folder.CREATE_FOLDER_MODAL_HEADER}
      onCloseEvent={closeNewModal}
      data-testid="create-folder-modal"
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
      />
      <va-button
        text="Create"
        onClick={confirmNewFolder}
        data-testid="create-folder-button"
      />
      <va-button
        secondary="true"
        text="Cancel"
        onClick={closeNewModal}
        data-testid="cancel-folder-button"
      />
    </VaModal>
  );
};

CreateFolderModal.propTypes = {
  folders: PropTypes.array.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  setIsModalVisible: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default CreateFolderModal;
