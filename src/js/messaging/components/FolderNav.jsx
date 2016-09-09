import React from 'react';

import ComposeButton from './ComposeButton';

class FolderNav extends React.Component {
  render() {
    const folderList = this.props.folders.map((folder, i) => {
      return <li key={i}>
        {folder.name} ({folder.unread_count})
      </li>;
    });

    return (
      <div>
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
      name: React.PropTypes.string.isRequired,
      unread_count: React.PropTypes.number.isRequired
    })
  ).isRequired
};

export default FolderNav;
