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
import CernerFacilityAlert from 'platform/mhv/components/CernerFacilityAlert/CernerFacilityAlert';
import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
import {
  BlockedTriageAlertStyles,
  DefaultFolders as Folders,
  ParentComponent,
  downtimeNotificationParams,
} from '../../util/constants';
import { handleHeader, getPageTitle } from '../../util/helpers';
import { submitLaunchMyVaHealthAal } from '../../api/SmApi';
import ManageFolderButtons from '../ManageFolderButtons';
import SearchForm from '../Search/SearchForm';
import ComposeMessageButton from '../MessageActionButtons/ComposeMessageButton';
import BlockedTriageGroupAlert from '../shared/BlockedTriageGroupAlert';
import CernerTransitioningFacilityAlert from '../Alerts/CernerTransitioningFacilityAlert';
import InnerNavigation from '../InnerNavigation';
import useFeatureToggles from '../../hooks/useFeatureToggles';
import OracleHealthMessagingIssuesAlert from '../shared/OracleHealthMessagingIssuesAlert';

const FolderHeader = props => {
  const { folder, searchProps, threadCount } = props;
  const location = useLocation();
  const userFacilities = useSelector(state => state?.user?.profile?.facilities);
  const showInnerNav =
    folder.folderId === Folders.INBOX.id || folder.folderId === Folders.SENT.id;

  const drupalCernerFacilities = useSelector(selectCernerFacilities);

  const {
    noAssociations,
    allTriageGroupsBlocked,
    error: recipientsError,
  } = useSelector(state => state.sm.recipients);

  const {
    cernerPilotSmFeatureFlag,
    mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag,
    isAalEnabled,
  } = useFeatureToggles();

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
        const pageTitleTag = getPageTitle({
          folderName: folder.name,
        });
        updatePageTitle(pageTitleTag);
      }
    },
    [folder, location.pathname],
  );

  const { folderName, ddTitle, ddPrivacy } = handleHeader(folder);

  const handleMyVaHealthLinkClick = useCallback(
    () => {
      if (isAalEnabled) {
        submitLaunchMyVaHealthAal();
      }
    },
    [isAalEnabled],
  );

  const RecipientListErrorAlert = () => {
    return (
      <va-alert status="warning" data-testid="recipients-error-alert">
        <h2 slot="headline">We can’t load your care team list right now</h2>
        <p>
          We’re sorry. Something went wrong on our end. Please refresh this page
          or try again later.
        </p>
      </va-alert>
    );
  };
  const OracleHealthMessagingAlert = useCallback(
    () => {
      if (
        cernerPilotSmFeatureFlag &&
        mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag
      )
        return <OracleHealthMessagingIssuesAlert />;
      if (
        folder.folderId === Folders.INBOX.id &&
        cernerFacilities?.length > 0
      ) {
        return (
          <CernerFacilityAlert
            {...CernerAlertContent.SECURE_MESSAGING}
            className="vads-u-margin-bottom--3 vads-u-margin-top--2"
            onLinkClick={handleMyVaHealthLinkClick}
          />
        );
      }
      return null;
    },
    [
      cernerPilotSmFeatureFlag,
      mhvSecureMessagingCernerPilotSystemMaintenanceBannerFlag,
      folder.folderId,
      cernerFacilities,
    ],
  );

  return (
    <>
      <h1
        className="vads-u-margin-bottom--1"
        data-testid="folder-header"
        data-dd-action-name={ddTitle}
        data-dd-privacy={ddPrivacy}
      >
        {`Messages: ${folderName}`}
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
      <OracleHealthMessagingAlert />

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
        {recipientsError && <RecipientListErrorAlert />}
        {showInnerNav &&
          (!noAssociations && !allTriageGroupsBlocked && !recipientsError) && (
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
