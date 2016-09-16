import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

class FolderNav extends React.Component {
  constructor(props) {
    super(props);
    this.makeFolderLink = this.makeFolderLink.bind(this);
    this.makeMyFolders = this.makeMyFolders.bind(this);
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

  makeMyFolders(folderList) {
    // Determine if 'My folders' needs to be displayed as active based on
    // whether it contains the currently viewed folder.
    const myFolderLinks = folderList.map(this.makeFolderLink);
    const isLinkActive = (link) => {
      return this.context.router.isActive(link.props.to, true);
    };
    const myFoldersActive = myFolderLinks.find(isLinkActive);
    const myFoldersClass = classNames({
      'messaging-my-folders': true,
      'usa-current': myFoldersActive
    });

    /* Render 'My folders' as expanded or collapsed. */

    let myFoldersList;

    if (this.props.expanded) {
      const myFolderListItems = folderList.map((folder, i) => {
        return <li key={folder.folder_id}>{myFolderLinks[i]}</li>;
      });

      myFoldersList = (
        <ul className="messaging-folder-subnav usa-sidenav-sub_list">
          {myFolderListItems}
        </ul>
      );
    }

    const iconClass = classNames({
      fa: true,
      'fa-caret-down': !this.props.expanded,
      'fa-caret-up': this.props.expanded
    });

    return (
      <li key="myFolders">
        <a className={myFoldersClass} onClick={this.props.onToggleFolders}>
          <span>My folders</span>
          <i className={iconClass}></i>
        </a>
        {myFoldersList}
      </li>
    );
  }

  render() {
    let folderList = this.props.folders;
    let myFolders;

    // If there are more than 5 folders, move all the non-default folders
    // into a expandable sublist called 'My folders'.
    if (folderList.length > 5) {
      myFolders = this.makeMyFolders(folderList.slice(4));
      folderList = folderList.slice(0, 4);
    }

    folderList = folderList.map(folder => {
      return (
        <li key={folder.folder_id}>
          {this.makeFolderLink(folder)}
        </li>
      );
    });

    folderList.push(myFolders);

    const folderActions = (
      <li className="messaging-folder-nav-actions">
        <button>
          <i className="fa fa-folder"></i>
          &nbsp;&nbsp;Manage folders
        </button>
        <button>
          <i className="fa fa-plus"></i>
          &nbsp;&nbsp;Create new folder
        </button>
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

FolderNav.contextTypes = {
  router: React.PropTypes.object
};

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
  ).isRequired,
  expanded: React.PropTypes.bool,
  onToggleFolders: React.PropTypes.func
};

export default FolderNav;
