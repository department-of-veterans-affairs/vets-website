import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  createNewFolder,
  setCurrentFolder,
  toggleFolderNav,
  toggleManagedFolders
} from '../actions/folders';

import {
  setNewFolderName,
  toggleCreateFolderModal
} from '../actions/modals';

import { makeField } from '../../common/model/fields';
import ButtonClose from '../components/buttons/ButtonClose';
import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';
import ModalCreateFolder from '../components/ModalCreateFolder';
import MessageSearch from '../components/MessageSearch';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleFolderChange = this.handleFolderChange.bind(this);
    this.handleFolderNameChange = this.handleFolderNameChange.bind(this);
    this.handleCreateNewFolderModal = this.handleCreateNewFolderModal.bind(this);
    this.handleSubmitCreateNewFolder = this.handleSubmitCreateNewFolder.bind(this);
  }

  handleFolderChange(domEvent) {
    const folderId = domEvent.target.dataset.folderid;
    this.props.setCurrentFolder(folderId);
  }

  handleFolderNameChange(field) {
    this.props.setNewFolderName(field);
  }

  handleCreateNewFolderModal() {
    // Reset the form / state object when closed
    const resetForm = makeField('');
    this.props.setNewFolderName(resetForm);
    this.props.toggleCreateFolderModal();
  }

  handleSubmitCreateNewFolder(folderName) {
    this.props.createNewFolder(folderName);
    this.handleCreateNewFolderModal();
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
              onCreateNewFolder={this.props.toggleCreateFolderModal}
              onFolderChange={this.handleOnFolderChange}/>
        </div>
        <div id="messaging-content">
          <MessageSearch onSubmit={(e) => { e.preventDefault(); }}/>
          {this.props.children}
        </div>
        <ModalCreateFolder
            cssClass="messaging-modal"
            folders={this.props.folders}
            id="messaging-create-folder"
            onClose={this.handleCreateNewFolderModal}
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
  createNewFolder,
  toggleCreateFolderModal,
  toggleFolderNav,
  toggleManagedFolders,
  setCurrentFolder,
  setNewFolderName
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
