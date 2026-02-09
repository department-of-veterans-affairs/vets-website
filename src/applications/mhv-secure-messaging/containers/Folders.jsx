import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import { getFolders, newFolder } from '../actions/folders';
import { closeAlert } from '../actions/alerts';
import {
  BlockedTriageAlertStyles,
  Breadcrumbs,
  ParentComponent,
} from '../util/constants';
import { getPageTitle } from '../util/helpers';
import FoldersList from '../components/FoldersList';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import CreateFolderInline from '../components/FoldersList/CreateFolderInline';
import InnerNavigation from '../components/InnerNavigation';
import ComposeMessageButton from '../components/MessageActionButtons/ComposeMessageButton';
import BlockedTriageGroupAlert from '../components/shared/BlockedTriageGroupAlert';

const Folders = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const folders = useSelector(state => state.sm.folders.folderList);
  const [newlyCreatedFolderName, setNewlyCreatedFolderName] = useState(null);

  const { noAssociations, allTriageGroupsBlocked } = useSelector(
    state => state.sm.recipients,
  );

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
    [dispatch, location],
  );

  useEffect(
    () => {
      const pageTitleTag = getPageTitle({
        pathname: location.pathname,
      });

      // Always focus on H1 per MHV accessibility decision records.
      // Alert content is announced via role="status" without stealing focus.
      if (folders !== undefined) {
        focusElement(document.querySelector('h1'));
      }
      updatePageTitle(pageTitleTag);
    },
    [alertList, folders, location.pathname],
  );

  const confirmFolderCreate = (folderName, onSuccess) => {
    dispatch(newFolder(folderName)).then(() => {
      onSuccess();
      dispatch(getFolders());
    });
  };

  const handleFolderCreated = folderName => {
    setNewlyCreatedFolderName(folderName);
  };

  const content = () => {
    const folderCount = folders?.length;
    if (folders === undefined) {
      return (
        <>
          <AlertBackgroundBox closeable />
          <va-loading-indicator
            message="Loading your secure message..."
            setFocus
          />
        </>
      );
    }
    if (folders === null || folders === false) {
      return (
        <>
          <AlertBackgroundBox closeable />
          <va-alert status="error" visible class="vads-u-margin-y--9">
            <h2 slot="headline">
              We’re sorry. Something went wrong on our end
            </h2>
            <p>
              You can’t view your secure message because something went wrong on
              our end. Please check back soon.
            </p>
          </va-alert>
        </>
      );
    }
    return (
      <>
        <h1 className="vads-u-margin-bottom--2" data-testid="my-folder-header">
          Messages: {Breadcrumbs.FOLDERS.label}
        </h1>

        <AlertBackgroundBox closeable />

        {(noAssociations || allTriageGroupsBlocked) && (
          <BlockedTriageGroupAlert
            alertStyle={
              noAssociations
                ? BlockedTriageAlertStyles.INFO
                : BlockedTriageAlertStyles.WARNING
            }
            blockedTriageGroupList={[]}
            parentComponent={ParentComponent.FOLDER_HEADER}
          />
        )}

        {!noAssociations && !allTriageGroupsBlocked && <ComposeMessageButton />}

        <InnerNavigation />

        {folderCount > 0 && (
          <>
            <FoldersList
              folders={folders.filter(
                folder => folder.id !== -1 && folder.id !== 0,
              )}
              highlightName={newlyCreatedFolderName}
            />
          </>
        )}
        <CreateFolderInline
          folders={folders}
          onConfirm={confirmFolderCreate}
          onFolderCreated={handleFolderCreated}
        />
      </>
    );
  };

  return <div className="folders-container">{content()}</div>;
};

export default Folders;
