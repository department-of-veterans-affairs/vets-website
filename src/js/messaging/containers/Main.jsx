import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import LoadingIndicator from '../../common/components/LoadingIndicator';

import {
  closeAdvancedSearch,
  closeAttachmentsModal,
  closeCreateFolderModal,
  createFolderAndMoveMessage,
  createNewFolder,
  fetchFolders,
  openCreateFolderModal,
  setCurrentFolder,
  setNewFolderName,
  toggleFolderNav,
  toggleManagedFolders
} from '../actions';

import ButtonClose from '../components/buttons/ButtonClose';
import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';
import ModalAttachments from '../components/compose/ModalAttachments';
import ModalCreateFolder from '../components/ModalCreateFolder';

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleFolderChange = this.handleFolderChange.bind(this);
    this.handleFolderNameChange = this.handleFolderNameChange.bind(this);
    this.handleSubmitCreateNewFolder = this.handleSubmitCreateNewFolder.bind(this);
  }

  componentDidMount() {
    this.props.fetchFolders();
  }

  handleFolderChange(domEvent) {
    const folderId = domEvent.target.dataset.folderid;
    this.props.setCurrentFolder(folderId);

    if (this.props.isVisibleAdvancedSearch) {
      this.props.closeAdvancedSearch();
    }
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
  }

  render() {
    const loading = this.props.loading;

    if (loading.folders) {
      return <LoadingIndicator message="Loading your application..."/>;
    }

    if (!this.props.folders || !this.props.folders.length) {
      return (
        <p>
          The application failed to load.
          Click <a href="/healthcare/messaging" onClick={(e) => {
            e.preventDefault();
            this.props.fetchFolders();
          }}> here</a> to try again.
        </p>
      );
    }

    if (loading.deletingFolder) {
      return <LoadingIndicator message="Deleting your folder..."/>;
    }

    if (loading.deletingMessage) {
      return <LoadingIndicator message="Deleting message..."/>;
    }

    if (loading.movingMessage) {
      return <LoadingIndicator message="Moving message..."/>;
    }

    if (loading.savingDraft) {
      return <LoadingIndicator message="Saving your message..."/>;
    }

    if (loading.sendingMessage) {
      return <LoadingIndicator message="Sending your message..."/>;
    }

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
              onFolderChange={this.handleFolderChange}/>
        </div>
        <div id="messaging-content">
          {this.props.children}
        </div>
        <ModalAttachments
            cssClass="messaging-modal"
            text={this.props.attachmentsModal.message.text}
            title={this.props.attachmentsModal.message.title}
            id="messaging-add-attachments"
            onClose={this.props.closeAttachmentsModal}
            visible={this.props.attachmentsModal.visible}/>
        <ModalCreateFolder
            cssClass="messaging-modal"
            folders={this.props.folders}
            id="messaging-create-folder"
            loading={loading.creatingFolder}
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
    attachmentsModal: state.modals.attachments,
    createFolderModal: state.modals.createFolder,
    folders: Array.from(state.folders.data.items.values()),
    isVisibleAdvancedSearch: state.search.advanced.visible,
    loading: state.loading,
    nav: state.folders.ui.nav,
    persistFolder: state.folders.data.currentItem.persistFolder
  };
};

const mapDispatchToProps = {
  closeAdvancedSearch,
  closeAttachmentsModal,
  closeCreateFolderModal,
  createFolderAndMoveMessage,
  createNewFolder,
  fetchFolders,
  openCreateFolderModal,
  setCurrentFolder,
  setNewFolderName,
  toggleFolderNav,
  toggleManagedFolders
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
