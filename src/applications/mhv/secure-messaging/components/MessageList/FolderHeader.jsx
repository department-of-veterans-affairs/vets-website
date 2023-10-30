import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// How to use CernerCallToAction component inside SM if possible?
// import CernerCallToAction from '../../../../static-pages/health-care-manage-benefits/components/CernerCallToAction';
import { DefaultFolders as Folders, PageTitles } from '../../util/constants';
import { handleHeader, updatePageTitle } from '../../util/helpers';
import ManageFolderButtons from '../ManageFolderButtons';
import SearchForm from '../Search/SearchForm';
import ComposeMessageButton from '../MessageActionButtons/ComposeMessageButton';
import CernerFacilityAlert from './CernerFacilityAlert';
// What are the use cases for the these props below?
// import { facilitiesPropType, cernerFacilitiesPropType } from '../../../../static-pages/health-care-manage-benefits/propTypes';

const FolderHeader = props => {
  const { folder, searchProps, threadCount, facilities } = props;
  const location = useLocation();

  // Is this the correct state to get the user's cerner info from? -->
  // const isCerner = useSelector(state => state.user.profile?.facilities);
  const cernerFacilities = facilities?.filter(f => f.isCerner);

  // Where is the List of Cerner Facilities names in conjuction with facilityId?
  // const cernerFacilitiesPropType = PropTypes.arrayOf(
  //   PropTypes.shape({
  //     facilityId: PropTypes.string.isRequired,
  //     isCerner: PropTypes.bool.isRequired,
  //     usesCernerAppointments: PropTypes.bool,
  //     usesCernerMedicalRecords: PropTypes.bool,
  //     usesCernerMessaging: PropTypes.bool,
  //     usesCernerRx: PropTypes.bool,
  //     usesCernerTestResults: PropTypes.bool,
  //   }).isRequired,
  // );
  // is user logged in
  // is user cerner patient

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

  // const handleCernerBanner = useCallback(
  //   () => {
  //     return (
  //       // if inbox &&
  //       folder.folderId === Folders.INBOX.id && (
  //         <CernerFacilityAlert cernerFacilities={cernerFacilities} />
  //         // Folders.INBOX.id &&
  //         // <CernerCallToAction
  //         //   // cernerFacilities={cernerFacilities}
  //         //   // otherFacilities={otherFacilities}
  //         //   // ehrDataByVhaId={ehrDataByVhaId}
  //         //   linksHeaderText="Send a secure message to a provider at:"
  //         //   // myHealtheVetLink={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
  //         //   // myVAHealthLink={getCernerURL(
  //         //   //   '/pages/messaging/inbox',
  //         //   //   useSingleLogout,
  //         //   // )}
  //         //   // widgetType={widgetType}
  //         // />
  //         // 'This is a test. You are doing great.'
  //       )
  //     );
  //   },
  //   [folder],
  // );

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
        <CernerFacilityAlert cernerFacilities={cernerFacilities} />
      )}

      <>{handleFolderDescription()}</>
      {/* <>{console.log('cerner: ', isCerner)}</> */}
      {folder.folderId === Folders.INBOX.id && <ComposeMessageButton />}
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
  );
};

FolderHeader.propTypes = {
  facilities: PropTypes.arrayOf(PropTypes.object),
  folder: PropTypes.object,
  searchProps: PropTypes.object,
  threadCount: PropTypes.number,
};

export default FolderHeader;
