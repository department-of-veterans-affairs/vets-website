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

    return (
      <ul className="messaging-folder-nav usa-sidenav-list">
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
      count: React.PropTypes.number.isRequired,
      unread_count: React.PropTypes.number.isRequired
      /* eslint-enable */
    })
  ).isRequired
};

export default FolderNav;
