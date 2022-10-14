import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FoldersList = props => {
  const { folders } = props;

  return (
    <div>
      <ul className="folders-list">
        {!!folders.length &&
          folders.filter(folder => folder.id > 0).map(folder => (
            <li key={folder.name}>
              <Link to={`/folder/${folder.id}`}>
                <i className="fas fa-folder" aria-hidden="true" />
                {folder.name}
              </Link>
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
