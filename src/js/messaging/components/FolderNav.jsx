import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import ButtonCreateFolder from './buttons/ButtonCreateFolder';

class FolderNav extends React.Component {
  constructor(props) {
    super(props);
    this.goToFolderSettings = this.goToFolderSettings.bind(this);
    this.makeFolderLink = this.makeFolderLink.bind(this);
    this.makeMyFolders = this.makeMyFolders.bind(this);
  }

  goToFolderSettings() {
    this.context.router.push('/settings');
  }

  makeFolderLink(folder) {
    let count;

    if (folder.name === 'Inbox' && folder.unreadCount > 0) {
      count = ` (${folder.unreadCount})`;
    } else if (folder.name === 'Drafts' && folder.count > 0) {
      count = ` (${folder.count})`;
    }

    // Using this to persist usa-current class when veteran
    // enters a thread. Link does this automatically when the
    // URL and href match.
    const isPersistFolder = classNames({
      'messaging-folder-nav-link': true,
      'usa-current': this.props.persistFolder === folder.folderId
    });

    return (
      <Link
          activeClassName="usa-current"
          className={isPersistFolder}
          data-folderid={folder.folderId}
          to={`/folder/${folder.folderId}`}
          onClick={this.props.onFolderChange}>
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

    if (this.props.isExpanded) {
      const myFolderListItems = folderList.map((folder, i) => {
        return <li key={folder.folderId}>{myFolderLinks[i]}</li>;
      });

      myFoldersList = (
        <ul className="messaging-folder-subnav usa-sidenav-sub_list">
          {myFolderListItems}
        </ul>
      );
    }

    const iconClass = classNames({
      fa: true,
      'fa-caret-down': !this.props.isExpanded,
      'fa-caret-up': this.props.isExpanded
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
        <li key={folder.folderId}>
          {this.makeFolderLink(folder)}
        </li>
      );
    });

    folderList.push(myFolders);

    const folderActions = (
      <li className="messaging-folder-nav-actions">
        <button onClick={this.goToFolderSettings}>
          <i className="fa fa-folder"></i>
          &nbsp;Manage folders
        </button>
        <ButtonCreateFolder onClick={this.props.onCreateNewFolder}/>
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
  router: React.PropTypes.object.isRequired
};

FolderNav.propTypes = {
  persistFolder: React.PropTypes.number,
  folders: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      folderId: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      count: React.PropTypes.number.isRequired,
      unreadCount: React.PropTypes.number.isRequired
    })
  ).isRequired,
  isExpanded: React.PropTypes.bool,
  onCreateNewFolder: React.PropTypes.func,
  onToggleFolders: React.PropTypes.func
};

export default FolderNav;
