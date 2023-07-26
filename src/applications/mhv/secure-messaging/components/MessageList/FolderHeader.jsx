import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { DefaultFolders as Folders, PageTitles } from '../../util/constants';
import { handleHeader, updatePageTitle } from '../../util/helpers';
import ManageFolderButtons from '../ManageFolderButtons';
import SearchForm from '../Search/SearchForm';
import ComposeMessageButton from '../MessageActionButtons/ComposeMessageButton';

const FolderHeader = props => {
  const { folder, searchProps } = props;
  const location = useLocation();
  const [showComposeMessage, setShowComposeMessage] = useState(false);
  const [folderDescription, setFolderDescription] = useState(null);

  useEffect(
    () => {
      switch (folder.folderId) {
        case Folders.INBOX.id:
        case Folders.SENT.id: // Inbox
          setFolderDescription(Folders.INBOX.desc);
          setShowComposeMessage(true);
          break;
        case Folders.DRAFTS.id: // Drafts
          setFolderDescription(Folders.DRAFTS.desc);
          setShowComposeMessage(true);
          break;
        case Folders.DELETED.id: // Trash
          setFolderDescription(Folders.DELETED.desc);
          setShowComposeMessage(false);
          break;
        default:
          setFolderDescription(Folders.CUSTOM_FOLDER.desc); // Custom Folder Sub-header;
          setShowComposeMessage(false);
          break;
      }
    },
    [folder],
  );

  const handleFolderDescription = () => {
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
  };

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
      <h1 data-testid="folder-header">
        {handleHeader(folder.folderId, folder)}
      </h1>
      <>{handleFolderDescription()}</>
      {showComposeMessage && <ComposeMessageButton />}
      <ManageFolderButtons />
      {folder.count > 0 && (
        <SearchForm
          folder={folder}
          keyword=""
          resultsCount={searchProps.searchResults?.length}
          {...searchProps}
        />
      )}
    </>
  );
};

FolderHeader.propTypes = {
  folder: PropTypes.object,
  searchProps: PropTypes.object,
};

export default FolderHeader;
