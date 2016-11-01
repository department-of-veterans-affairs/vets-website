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
import { paths } from '../config';

export class Settings extends React.Component {
  render() {
    const folderRows = this.props.folders.map(folder => {
      const link = `${paths.FOLDERS_URL}/${folder.folderId}`;

      return (
        <tr key={folder.folderId}>
          <td>
            <Link to={link}>
              {folder.name}
            </Link>
          </td>
          <td>
            {folder.count}
          </td>
          <td>
            <ButtonDelete
                onClickHandler={() => this.props.deleteFolder(folder)}/>
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
          <ButtonCreateFolder onClick={this.props.openCreateFolderModal}/>
        </div>
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
  openCreateFolderModal,
  toggleFolderNav
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
