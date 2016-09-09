import React from 'react';
import { Link } from 'react-router';

class FolderNav extends React.Component {
  render() {
    const folderList = this.props.folders.map((folder, i) => {
      return (
        <li key={i}>
          <Link
              activeClassName="usa-current"
              to={`/messaging/folder/${folder.folder_id}`}>
            {folder.name} ({folder.unread_count})
          </Link>
        </li>
      );
    });

    return (
      <ul className="usa-sidenav-list">
        {folderList}
      </ul>
    );
  }
}

FolderNav.propTypes = {
  folders: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      // TODO: Remove when we switch to camel case.
      // Lack of camel case makes eslint complain.
      /* eslint-disable */
      folder_id: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      unread_count: React.PropTypes.number.isRequired
      /* eslint-enable */
    })
  ).isRequired
};

export default FolderNav;
