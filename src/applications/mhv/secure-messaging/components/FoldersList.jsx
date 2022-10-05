import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FoldersList = props => {
  const { folders } = props;

  return (
    <div>
      {' '}
      {!!folders.filter(folder => folder.id > 0).length && (
        <h2 className="folder-title">My Folders</h2>
      )}
      <ul className="folders-list">
        {!!folders.length &&
          folders.filter(folder => folder.id > 0).map(folder => (
            <li key={folder.name}>
              <Link to={`/folder/${folder.id}`}>{folder.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

FoldersList.propTypes = {
  folders: PropTypes.array,
};

export default FoldersList;
