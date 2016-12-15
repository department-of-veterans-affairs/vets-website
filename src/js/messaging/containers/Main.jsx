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

  componentDidUpdate() {
    if (this.props.redirect) {
      this.context.router.replace(this.props.redirect);
    }
  }

  handleFolderChange(domEvent) {
    const folderId = domEvent.target.dataset.folderid;
    this.props.setCurrentFolder(folderId);
    this.props.toggleFolderNav();

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

    this.props.closeCreateFolderModal();
  }

  render() {
    const loading = this.props.loading;

    if (loading.deleting) {
      return <LoadingIndicator message="Deleting the message..."/>;
    }

    if (loading.moving) {
      return <LoadingIndicator message="Moving the message..."/>;
    }

    if (loading.saving) {
      return <LoadingIndicator message="Saving the message..."/>;
    }

    if (loading.sending) {
      return <LoadingIndicator message="Sending the message..."/>;
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

Main.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const folders = [];
  state.folders.data.items.forEach(folder => folders.push(folder));

  return {
    attachmentsModal: state.modals.attachments,
    createFolderModal: state.modals.createFolder,
    folders,
    isVisibleAdvancedSearch: state.search.advanced.visible,
    loading: state.loading,
    nav: state.folders.ui.nav,
    persistFolder: state.folders.data.currentItem.persistFolder,
    redirect: state.folders.ui.redirect
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
