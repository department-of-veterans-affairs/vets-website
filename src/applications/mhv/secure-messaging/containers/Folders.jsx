import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import { getFolders, newFolder } from '../actions/folders';
import FoldersList from '../components/FoldersList';

const Folders = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const folders = useSelector(state => state.sm.folders.folderList);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');

  useEffect(
    () => {
      dispatch(getFolders());
    },
    [dispatch, location, isModalVisible],
  );

  const openNewModal = () => {
    setIsModalVisible(true);
  };

  const closeNewModal = () => {
    setIsModalVisible(false);
  };

  const confirmNewFolder = () => {
    dispatch(newFolder(folderName));
    dispatch(getFolders());
    closeNewModal();
  };

  const content = () => {
    if (folders === undefined) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
        />
      );
    }
    if (folders === null || folders === false) {
      return (
        <va-alert status="error" visible class="vads-u-margin-y--9">
          <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
          <p>
            You can’t view your secure message because something went wrong on
            our end. Please check back soon.
          </p>
        </va-alert>
      );
    }
    return (
      <>
        <h1>My folders</h1>
        <button type="button" className="modal-button" onClick={openNewModal}>
          Create new folder
        </button>
        <FoldersList folders={folders} />
        <VaModal
          className="modal"
          visible={isModalVisible}
          large="true"
          modalTitle="Create new folder"
          onCloseEvent={closeNewModal}
        >
          <VaTextInput
            onInput={e => setFolderName(e.target.value)}
            name="folder-name"
            label="Please enter your folder name"
          />
          <va-button text="Confirm" onClick={confirmNewFolder} />
          <va-button secondary="true" text="Cancel" onClick={closeNewModal} />
        </VaModal>
      </>
    );
  };

  return <div className="folders-container">{content()}</div>;
};

export default Folders;
