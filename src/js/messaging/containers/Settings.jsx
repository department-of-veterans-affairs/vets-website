import React from 'react';
import { connect } from 'react-redux';

import {
  deleteFolder,
  toggleFolderNav
} from '../actions/folders';

import ButtonDelete from '../components/buttons/ButtonDelete';

class Settings extends React.Component {
  render() {
    const folderRows = this.props.folders.map(folder => {
      const deleteFolder = () => this.props.deleteFolder(folder);

      return (
        <tr key={folder.folderId}>
          <td>
            {folder.name}
          </td>
          <td>
            {folder.count}
          </td>
          <td>
            <ButtonDelete
              onClickHandler={deleteFolder}/>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <div id="messaging-content-header">
            <button
                className="messaging-menu-button"
                type="button"
                onClick={this.props.toggleFolderNav}>
              Menu
            </button>
            <h2>Settings</h2>
        </div>
        <table className="usa-table-borderless">
          <thead>
            <tr>
              <th>Folder name</th>
              <th>Total messages</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {folderRows}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    folders: state.folders.data.items.slice(4)
  };
};

const mapDispatchToProps = {
  deleteFolder,
  toggleFolderNav
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
