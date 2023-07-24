import React from 'react';
import PropTypes from 'prop-types';
import { DefaultFolders as Folders } from '../../util/constants';
import { handleHeader } from '../../util/helpers';
import ManageFolderButtons from '../ManageFolderButtons';
import SearchForm from '../Search/SearchForm';
import ComposeMessageButton from '../MessageActionButtons/ComposeMessageButton';

const FolderHeader = props => {
  const { folder, searchProps } = props;

  const handleFolderDescription = () => {
    let text = '';
    switch (folder.folderId) {
      case Folders.INBOX.id:
      case Folders.SENT.id: // Inbox
        text = Folders.INBOX.desc;
        break;
      case Folders.DRAFTS.id: // Drafts
        text = Folders.DRAFTS.desc;
        break;
      case Folders.DELETED.id: // Trash
        text = Folders.DELETED.desc;
        break;
      default:
        text = `This is a folder you created. You can add conversations to this folder by moving them from your inbox or other folders.`;
        break;
    }
    return (
      text && (
        <p
          data-testid="folder-description"
          className="va-introtext folder-description vads-u-margin-top--0"
        >
          {text}
        </p>
      )
    );
  };

  return (
    <>
      <h1 data-testid="folder-header">
        {handleHeader(folder.folderId, folder)}
      </h1>
      <>{handleFolderDescription()}</>
      {folder.folderId === Folders.INBOX.id && <ComposeMessageButton />}
      {folder.folderId === Folders.SENT.id && <ComposeMessageButton />}
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
