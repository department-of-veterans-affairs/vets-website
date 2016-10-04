import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  createNewFolder,
  setCurrentFolder,
  toggleFolderNav,
  toggleManagedFolders
} from '../actions/folders';

import { createFolderAndMoveMessage } from '../actions/messages';

import {
  setNewFolderName,
  closeCreateFolderModal,
  openCreateFolderModal
} from '../actions/modals';

import ButtonClose from '../components/buttons/ButtonClose';
import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';
import ModalCreateFolder from '../components/ModalCreateFolder';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleFolderChange = this.handleFolderChange.bind(this);
    this.handleFolderNameChange = this.handleFolderNameChange.bind(this);
    this.handleSubmitCreateNewFolder = this.handleSubmitCreateNewFolder.bind(this);
  }

  handleFolderChange(domEvent) {
    const folderId = domEvent.target.dataset.folderid;
    this.props.setCurrentFolder(folderId);
  }

  handleFolderNameChange(field) {
    this.props.setNewFolderName(field);
  }

  handleSubmitCreateNewFolder(folderName) {
    const messageId = this.props.createFolderModal.messageId;

    if (messageId !== undefined) {
      this.props.createFolderAndMoveMessage(folderName, messageId);
    } else {
      this.props.createNewFolder(folderName);
    }

    this.props.closeCreateFolderModal();
  }

  render() {
    const navClass = classNames({
      opened: this.props.nav.visible
    });

    return (
      <div id="messaging-main">
        <div id="messaging-nav" className={navClass}>
          <ButtonClose
              className="messaging-folder-nav-close"
              onClick={this.props.toggleFolderNav}/>
          <ComposeButton/>
          <FolderNav
              persistFolder={this.props.persistFolder}
              folders={this.props.folders}
              isExpanded={this.props.nav.foldersExpanded}
              onToggleFolders={this.props.toggleManagedFolders}
              onCreateNewFolder={this.props.openCreateFolderModal}
              onFolderChange={this.handleOnFolderChange}/>
        </div>
        <div id="messaging-content">
          {this.props.children}
        </div>
        <ModalCreateFolder
            cssClass="messaging-modal"
            folders={this.props.folders}
            id="messaging-create-folder"
            onClose={this.props.closeCreateFolderModal}
            onValueChange={this.handleFolderNameChange}
            onSubmit={this.handleSubmitCreateNewFolder}
            visible={this.props.createFolderModal.visible}
            newFolderName={this.props.createFolderModal.newFolderName}/>
      </div>
    );
  }
}

Main.propTypes = {
  children: React.PropTypes.node
};

const mapStateToProps = (state) => {
  return {
    createFolderModal: state.modals.createFolder,
    folders: state.folders.data.items,
    nav: state.folders.ui.nav,
    persistFolder: state.folders.data.currentItem.persistFolder
  };
};

const mapDispatchToProps = {
  closeCreateFolderModal,
  createFolderAndMoveMessage,
  createNewFolder,
  openCreateFolderModal,
  toggleFolderNav,
  toggleManagedFolders,
  setCurrentFolder,
  setNewFolderName
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
