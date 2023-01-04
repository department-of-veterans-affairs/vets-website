import React from 'react';
import { useSelector } from 'react-redux';
import FoldersList from '../FoldersList';
import { foldersList as folders } from '../../selectors';

const DashboardFolders = () => {
  const foldersList = useSelector(folders);

  return (
    <div className="dashboard-folders">
      <h2>Folders</h2>
      <div className="dashboard-folders-card">
        {foldersList === undefined ? (
          <va-loading-indicator
            class="vads-u-margin-y--2"
            message="Loading your folders..."
            data-testid="loading-indicator"
          />
        ) : (
          <>{foldersList && <FoldersList folders={foldersList} showUnread />}</>
        )}
      </div>
    </div>
  );
};

export default DashboardFolders;
