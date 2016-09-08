import React from 'react';

import ComposeButton from './ComposeButton';

class FolderNav extends React.Component {
  render() {
    const folderList = this.props.folders.map(
      (folder, i) => <li key={i}>{folder}</li>
    );

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
  folders: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
};

export default FolderNav;
