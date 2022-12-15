import React, { useState } from 'react';
import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
      setNameWarning('Folder name cannot be blank');
    } else if (folderMatch.length > 0) {
      setNameWarning('Folder name alreeady in use. Please use another name.');
    } else if (folderName.match(/^[0-9a-zA-Z\s]+$/)) {
      onConfirm(folderName, closeNewModal);
    } else {
      setNameWarning(
        'Folder name can only contain letters, numbers, and spaces.',
      );
    }
  };

  return (
    <VaModal
      className="modal"
      visible={isModalVisible}
      large="true"
      modalTitle="Create new folder"
      onCloseEvent={closeNewModal}
    >
      <p className="vads-u-margin--0">Please enter your folder name</p>
      <p className="vads-u-color--gray-medium vads-u-margin--0">
        (50 characters maximum)
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

export default CreateFolderModal;
