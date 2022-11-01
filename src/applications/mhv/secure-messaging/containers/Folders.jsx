import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  VaModal,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import { getFolders, newFolder } from '../actions/folders';
import { closeAlert } from '../actions/alerts';
import FoldersList from '../components/FoldersList';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';

const Folders = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const folders = useSelector(state => state.sm.folders.folderList);
  const [nameWarning, setNameWarning] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  let folderMatch = null;

  // clear out alerts if user navigates away from this component
  useEffect(
    () => {
      return () => {
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [location.pathname, dispatch],
  );

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
      closeNewModal();
      dispatch(newFolder(folderName));
    } else {
      setNameWarning(
        'Folder name can only contain letters, numbers, and spaces.',
      );
    }
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
        <AlertBackgroundBox closeable />
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
            className="input"
            value={folderName}
            onInput={e => setFolderName(e.target.value)}
            maxlength="50"
            error={nameWarning}
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
