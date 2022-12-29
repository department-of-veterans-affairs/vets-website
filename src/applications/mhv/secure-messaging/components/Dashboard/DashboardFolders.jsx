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
        {foldersList && <FoldersList folders={foldersList} />}
      </div>
    </div>
  );
};

export default DashboardFolders;
