import React from 'react';
import { Link } from 'react-router';

class FolderNav extends React.Component {
  constructor(props) {
    super(props);
    this.makeFolderLink = this.makeFolderLink.bind(this);
  }

  makeFolderLink(folder) {
    let count;

    if (folder.name === 'Inbox' && folder.unread_count > 0) {
      count = ` (${folder.unread_count})`;
    } else if (folder.name === 'Drafts' && folder.count > 0) {
      count = ` (${folder.count})`;
    }

    return (
      <Link
          activeClassName="usa-current"
          className="messaging-folder-nav-link"
          to={`/messaging/folder/${folder.folder_id}`}>
        {folder.name}
        {count}
      </Link>
    );
  }

  render() {
    const folderList = this.props.folders.map((folder, i) => {
      return <li key={i}>{this.makeFolderLink(folder)}</li>;
    });

    const folderActions = (
      <li className="messaging-folder-nav-actions">
        <a>
          <i className="fa fa-folder"></i>
          &nbsp;Manage folders
        </a>
        <a>
          <i className="fa fa-plus"></i>
          &nbsp;Create new folder
        </a>
      </li>
    );

    return (
      <ul className="messaging-folder-nav usa-sidenav-list">
        {folderList}
        {folderActions}
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
      count: React.PropTypes.number.isRequired,
      unread_count: React.PropTypes.number.isRequired
      /* eslint-enable */
    })
  ).isRequired
};

export default FolderNav;
