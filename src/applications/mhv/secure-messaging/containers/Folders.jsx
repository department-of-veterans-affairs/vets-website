import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import recordEvent from 'platform/monitoring/record-event';
import { getFolders, newFolder } from '../actions/folders';
import { closeAlert } from '../actions/alerts';
import { PageTitles } from '../util/constants';
import FoldersList from '../components/FoldersList';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import CreateFolderModal from '../components/Modals/CreateFolderModal';

const Folders = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const folders = useSelector(state => state.sm.folders.folderList);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  useEffect(
    () => {
      if (!isModalVisible) {
        const alertVisible = alertList[alertList?.length - 1];
        const alertSelector =
          folders !== undefined && !alertVisible?.isActive
            ? 'h1'
            : alertVisible?.isActive && 'va-alert';
        focusElement(document.querySelector(alertSelector));
        updatePageTitle(PageTitles.MY_FOLDERS_PAGE_TITLE_TAG);
      }
    },
    [alertList, folders, isModalVisible],
  );

  const openNewModal = () => {
    dispatch(closeAlert());
    setIsModalVisible(true);
  };

  const confirmFolderCreate = (folderName, closeNewModal) => {
    dispatch(newFolder(folderName))
      .then(dispatch(getFolders()))
      .finally(closeNewModal());
  };

  const content = () => {
    const folderCount = folders?.length;
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
        <h1 className="vads-u-margin-bottom--2" data-testid="my-folder-header">
          My folders
        </h1>

        <va-button
          onClick={() => {
            openNewModal();
            recordEvent({
              event: 'cta-button-click',
              'button-type': 'primary',
              'button-click-label': 'Create new folder',
            });
          }}
          text="Create new folder"
          data-testid="create-new-folder"
          data-dd-action-name="Create New Folder Button"
        />
        {folderCount > 0 && (
          <>
            <FoldersList folders={folders.filter(folder => folder.id > 0)} />
          </>
        )}
        <CreateFolderModal
          isCreateNewModalVisible={isModalVisible}
          setIsCreateNewModalVisible={setIsModalVisible}
          onConfirm={confirmFolderCreate}
          folders={folders}
        />
      </>
    );
  };

  return (
    <div className="folders-container">
      <AlertBackgroundBox closeable />
      {content()}
    </div>
  );
};

export default Folders;
