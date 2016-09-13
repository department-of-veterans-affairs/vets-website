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
    let folderList = this.props.folders.map(folder => {
      return (
        <li key={folder.folder_id}>
          {this.makeFolderLink(folder)}
        </li>
      );
    });

    let myFolders;

    // If there are more than 5 folders, move all the non-default folders
    // into a expandable sublist called 'My folders'.
    if (folderList.length > 5) {
      myFolders = (
        <li key="myFolders">
          <a>My folders</a>
          <ul className="usa-sidenav-sub_list">
            {folderList.slice(4)}
          </ul>
        </li>
      );

      folderList = folderList.slice(0, 4);
      folderList.push(myFolders);
    }

    const folderActions = (
      <li className="messaging-folder-nav-actions">
        <a>
          <i className="fa fa-folder"></i>
          &nbsp;&nbsp;Manage folders
        </a>
        <a>
          <i className="fa fa-plus"></i>
          &nbsp;&nbsp;Create new folder
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
