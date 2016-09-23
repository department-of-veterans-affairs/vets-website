import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  toggleFolderNav,
  toggleManagedFolders,
  setCurrentFolder
} from '../actions/folders';

import ButtonClose from '../components/buttons/ButtonClose';
import { toggleCreateFolderModal } from '../actions/modals';
import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';
import ModalCreateFolder from '../components/ModalCreateFolder';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnFolderChange = this.handleOnFolderChange.bind(this);
  }

  handleOnFolderChange(domEvent) {
    const folderId = domEvent.target.dataset.folderid;
    this.props.setCurrentFolder(folderId);
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
              isExpanded={this.props.navIsExpanded}
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
            onClose={this.props.toggleCreateFolderModal}
            visible={this.props.createFolderModalIsOpen}/>
      </div>
    );
  }
}

Main.propTypes = {
  children: React.PropTypes.node
};

const mapStateToProps = (state) => {
  return {
    persistFolder: state.folders.data.currentItem.persistFolder,
    createFolderModalIsOpen: state.modals.createFolder.visible,
    folders: state.folders.data.items,
    foldersExpanded: state.folders.ui.nav.foldersExpanded,
    isNavVisible: state.folders.ui.nav.visible
  };
};

const mapDispatchToProps = {
  toggleCreateFolderModal,
  toggleFolderNav,
  toggleManagedFolders,
  setCurrentFolder
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
