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

  handleSubmitCreateNewFolder(domEvent) {
    domEvent.preventDefault();
    const input = domEvent.target.getElementsByTagName('input')[0];
    // If, by chance, the veteran has submitted this form without touching the
    // folder name field, trigger an action that will trigger an error.
    if (input.value === '') {
      this.props.setNewFolderName({ value: '', dirty: true });
    } else {
      this.props.createNewFolder(input.value);
    }
    this.handleCreateNewFolderModal();
  }

  render() {
    const navClass = classNames({
      opened: this.props.isNavVisible
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
              isExpanded={this.props.hasFoldersExpanded}
              onToggleFolders={this.props.toggleManagedFolders}
              onCreateNewFolder={this.props.toggleCreateFolderModal}
              onFolderChange={this.handleOnFolderChange}/>
        </div>
        <div id="messaging-content">
          {this.props.children}
        </div>
        <ModalCreateFolder
            cssClass="messaging-modal"
            folders={this.props.folders}
            id="messaging-create-folder"
            onClose={this.handleCreateNewFolderModal}
            onValueChange={this.handleFolderNameChange}
            onSubmit={this.handleSubmitCreateNewFolder}
            visible={this.props.isCreateFolderModalOpen}
            newFolderName={this.props.newFolderName}/>
      </div>
    );
  }
}

Main.propTypes = {
  children: React.PropTypes.node
};

const mapStateToProps = (state) => {
  return {
    folders: state.folders.data.items,
    foldersExpanded: state.folders.ui.nav.foldersExpanded,
    hasFoldersExpanded: state.folders.ui.nav.foldersExpanded,
    isCreateFolderModalOpen: state.modals.createFolder.visible,
    isNavVisible: state.folders.ui.nav.visible,
    newFolderName: state.modals.createFolder.newFolderName,
    persistFolder: state.folders.data.currentItem.persistFolder,
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
