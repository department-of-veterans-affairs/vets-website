import React from 'react';
import { IndexLink} from 'react-router';

import ComposeButton from './ComposeButton';

class FolderNav extends React.Component {
  render() {
    const folderList = this.props.folders.map((folder, i) => {
      return <li key={i}>
        <IndexLink
            activeClassName="usa-current"
            to={`/messaging/folder/${folder.folder_id}`}>
          {folder.name} ({folder.unread_count})
        </IndexLink>
      </li>;
    });

    return (
      <div id="messaging-folder-nav">
        <ComposeButton/>
        <ul className="usa-sidenav-list">
          {folderList}
        </ul>
      </div>
    );
  }
}

FolderNav.propTypes = {
  folders: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      folder_id: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      unread_count: React.PropTypes.number.isRequired
    })
  ).isRequired
};

export default FolderNav;
