import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { navigateToFoldersPage } from '../util/helpers';
import { delFolder, getFolders } from '../actions/folders';

const ManageFolderButtons = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const [folderId, setFolderId] = useState(null);
  const messages = useSelector(state => state.sm.messages?.messageList);
  const folder = useSelector(state => state.sm.folders.folder);
  const [isEmptyWarning, setIsEmptyWarning] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(
    () => {
      if (location.pathname.includes('/folder')) {
        setFolderId(params.folderId);
      }
    },
    [dispatch, location.pathname, params.folderId],
  );

  const openDelModal = () => {
    if (messages.length > 0) {
      setIsEmptyWarning(true);
    } else {
      setIsEmptyWarning(false);
    }
    setIsModalVisible(true);
  };

  const closeDelModal = () => {
    setIsModalVisible(false);
  };

  const confirmDelFolder = () => {
    closeDelModal();
    dispatch(delFolder(folderId)).then(
      dispatch(getFolders()).then(navigateToFoldersPage(history)),
    );
  };

  return (
    <>
      {folder.folderId > 0 && (
        // This container needs to be updated to USWDS v3 when the project updates. These buttons are to become a button group, segmented
        <div className="manage-folder-container">
          <button
            type="button"
            className="left-button usa-button-secondary"
            onClick={function noRefCheck() {}}
          >
            Edit folder name
          </button>
          <button
            type="button"
            className="right-button usa-button-secondary"
            onClick={openDelModal}
          >
            Remove folder
          </button>
        </div>
      )}
      {isEmptyWarning && (
        <VaModal
          className="modal"
          visible={isModalVisible}
          large="true"
          modalTitle="Empty this folder before removing it from the list."
          onCloseEvent={closeDelModal}
          status="warning"
        >
          <p>
            Before this folder can be removed, all of the messages in it must be
            moved to another folder, such as Trash, Messages, or a different
            custom folder.
          </p>
          <va-button text="Ok" onClick={closeDelModal} />
        </VaModal>
      )}
      {!isEmptyWarning && (
        <VaModal
          className="modal"
          visible={isModalVisible}
          large="true"
          modalTitle="Are you sure you want to remove this folder?"
          onCloseEvent={closeDelModal}
        >
          <p>This action cannot be undone</p>
          <va-button text="Remove" onClick={confirmDelFolder} />
          <va-button secondary="true" text="Cancel" onClick={closeDelModal} />
        </VaModal>
      )}
    </>
  );
};

export default ManageFolderButtons;
