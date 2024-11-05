import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import {
  updatePageTitle,
  renderMHVDowntime,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import {
  BlockedTriageAlertStyles,
  DefaultFolders as Folders,
  PageTitles,
  ParentComponent,
  downtimeNotificationParams,
} from '../../util/constants';
import { handleHeader } from '../../util/helpers';
import ManageFolderButtons from '../ManageFolderButtons';
import SearchForm from '../Search/SearchForm';
import ComposeMessageButton from '../MessageActionButtons/ComposeMessageButton';
import CernerFacilityAlert from './CernerFacilityAlert';
import BlockedTriageGroupAlert from '../shared/BlockedTriageGroupAlert';
import CernerTransitioningFacilityAlert from '../Alerts/CernerTransitioningFacilityAlert';
import InnerNavigation from '../InnerNavigation';

const FolderHeader = props => {
  const { folder, searchProps, threadCount } = props;
  const location = useLocation();
  const userFacilities = useSelector(state => state?.user?.profile?.facilities);
  const showInnerNav =
    folder.folderId === Folders.INBOX.id || folder.folderId === Folders.SENT.id;

  const drupalCernerFacilities = useSelector(selectCernerFacilities);

  const { noAssociations, allTriageGroupsBlocked } = useSelector(
    state => state.sm.recipients,
  );

  const cernerFacilities = useMemo(
    () => {
      return userFacilities?.filter(facility =>
        drupalCernerFacilities.some(
          f => f.vhaId === facility.facilityId && f.ehr === 'cerner',
        ),
      );
    },
    [userFacilities, drupalCernerFacilities],
  );

  const folderDescription = useMemo(
    () => {
      switch (folder.folderId) {
        case Folders.INBOX.id:
        case Folders.SENT.id: // Inbox
          return Folders.INBOX.desc;
        case Folders.DRAFTS.id: // Drafts
          return Folders.DRAFTS.desc;
        case Folders.DELETED.id: // Trash
          return Folders.DELETED.desc;
        default:
          return Folders.CUSTOM_FOLDER.desc; // Custom Folder Sub-header;
      }
    },
    [folder],
  );

  const handleFolderDescription = useCallback(
    () => {
      return (
        folderDescription && (
          <p
            data-testid="folder-description"
            className="va-introtext folder-description vads-u-margin-top--0"
          >
            {folderDescription}
          </p>
        )
      );
    },
    [folderDescription],
  );

  useEffect(
    () => {
      if (location.pathname.includes(folder?.folderId)) {
        updatePageTitle(`${folder.name} ${PageTitles.PAGE_TITLE_TAG}`);
      }
    },
    [folder, location.pathname],
  );

  const { folderName, ddTitle, ddPrivacy } = handleHeader(
    folder.folderId,
    folder,
  );

  return (
    <>
      <h1
        className="vads-u-margin-bottom--1"
        data-testid="folder-header"
        data-dd-action-name={ddTitle}
        data-dd-privacy={ddPrivacy}
      >
        {folderName}
      </h1>

      {folder.folderId === Folders.INBOX.id && (
        <DowntimeNotification
          appTitle={downtimeNotificationParams.appTitle}
          dependencies={[externalServices.mhvPlatform, externalServices.mhvSm]}
          render={renderMHVDowntime}
        />
      )}

      {folder.folderId === Folders.INBOX.id && (
        <CernerTransitioningFacilityAlert />
      )}

      {folder.folderId === Folders.INBOX.id &&
        cernerFacilities?.length > 0 && (
          <CernerFacilityAlert cernerFacilities={cernerFacilities} />
        )}

      <>
        {folder.folderId === Folders.INBOX.id &&
          (noAssociations || allTriageGroupsBlocked) && (
            <BlockedTriageGroupAlert
              alertStyle={
                noAssociations
                  ? BlockedTriageAlertStyles.INFO
                  : BlockedTriageAlertStyles.WARNING
              }
              parentComponent={ParentComponent.FOLDER_HEADER}
            />
          )}

        <>{handleFolderDescription()}</>
        {showInnerNav &&
          (!noAssociations && !allTriageGroupsBlocked) && (
            <ComposeMessageButton />
          )}

        {showInnerNav && <InnerNavigation />}

        <ManageFolderButtons folder={folder} />
        {threadCount > 0 && (
          <SearchForm
            folder={folder}
            keyword=""
            resultsCount={searchProps.searchResults?.length}
            {...searchProps}
            threadCount={threadCount}
          />
        )}
      </>
    </>
  );
};

FolderHeader.propTypes = {
  folder: PropTypes.object,
  searchProps: PropTypes.object,
  threadCount: PropTypes.number,
};

export default FolderHeader;
