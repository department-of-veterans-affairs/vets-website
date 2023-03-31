import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Alerts } from '../../util/constants';

const CreateFolderModal = props => {
  const { isModalVisible, setIsModalVisible, onConfirm, folders } = props;
  const [folderName, setFolderName] = useState('');
  const [nameWarning, setNameWarning] = useState('');
  let folderMatch = null;

  const closeNewModal = () => {
    setFolderName('');
    setNameWarning('');
    setIsModalVisible(false);
  };

  const confirmNewFolder = () => {
    folderMatch = null;
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
    >
      <p
        className="vads-u-margin--0"
        data-testid="folder-enter-name-message-text"
      >
        {Alerts.Folder.CREATE_FOLDER_MODAL_LABEL}
      </p>
      <VaTextInput
        className="input vads-u-margin--0"
        value={folderName}
        onInput={e => setFolderName(e.target.value)}
        maxlength="50"
        error={nameWarning}
        name="folder-name"
      />
      <va-button text="Create" onClick={confirmNewFolder} />
      <va-button secondary="true" text="Cancel" onClick={closeNewModal} />
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
