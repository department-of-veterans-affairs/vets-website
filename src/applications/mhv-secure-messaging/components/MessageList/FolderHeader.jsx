import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import {
  BlockedTriageAlertStyles,
  DefaultFolders as Folders,
  PageTitles,
  ParentComponent,
} from '../../util/constants';
import { handleHeader } from '../../util/helpers';
import ManageFolderButtons from '../ManageFolderButtons';
import SearchForm from '../Search/SearchForm';
import ComposeMessageButton from '../MessageActionButtons/ComposeMessageButton';
import CernerFacilityAlert from './CernerFacilityAlert';
import BlockedTriageGroupAlert from '../shared/BlockedTriageGroupAlert';
import CernerTransitioningFacilityAlert from '../Alerts/CernerTransitioningFacilityAlert';

const FolderHeader = props => {
  const { folder, searchProps, threadCount } = props;
  const location = useLocation();
  const userFacilities = useSelector(state => state?.user?.profile?.facilities);

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

  return (
    <>
      <h1 className="vads-u-margin-bottom--1" data-testid="folder-header">
        {handleHeader(folder.folderId, folder)}
      </h1>

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
              blockedTriageGroupList={[]}
              parentComponent={ParentComponent.FOLDER_HEADER}
            />
          )}

        <>{handleFolderDescription()}</>
        {folder.folderId === Folders.INBOX.id &&
          (!noAssociations && !allTriageGroupsBlocked) && (
            <ComposeMessageButton />
          )}
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
