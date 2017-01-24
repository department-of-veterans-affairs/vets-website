import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
  deleteFolder,
  openCreateFolderModal,
  toggleFolderNav
} from '../actions';

import ButtonCreateFolder from '../components/buttons/ButtonCreateFolder';
import ButtonDelete from '../components/buttons/ButtonDelete';
import { folderUrl } from '../utils/helpers';

export class Settings extends React.Component {
  render() {
    const folderRows = this.props.folders.map(folder => {
      return (
        <tr key={folder.folderId}>
          <td>
            <Link to={folderUrl(folder.name)}>
              {folder.name}
            </Link>
          </td>
          <td>
            {folder.count}
          </td>
          <td>
            <ButtonDelete
                className="va-icon-link"
                onClick={() => this.props.deleteFolder(folder)}/>
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
        <div id="messaging-settings">
          <table className="usa-table-borderless va-table-list">
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
          <ButtonCreateFolder onClick={this.props.openCreateFolderModal}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const msgState = state.health.msg;
  const folders = [];
  msgState.folders.data.items.forEach((folder) => {
    if (folder.folderId > 0) {
      folders.push(folder);
    }
  });

  return {
    folders
  };
};

const mapDispatchToProps = {
  deleteFolder,
  openCreateFolderModal,
  toggleFolderNav
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
