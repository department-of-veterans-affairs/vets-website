import React from 'react';
import { connect } from 'react-redux';

import { toggleFolderNav } from '../actions/folders';
import { toggleCreateFolderModal } from '../actions/modals';
import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';
import ModalCreateFolder from '../components/ModalCreateFolder';

class Main extends React.Component {
  render() {
    return (
      <div>
        <div id="messaging-nav">
          <ComposeButton/>
          <FolderNav
              folders={this.props.folders}
              expanded={this.props.navExpanded}
              onToggleFolders={this.props.toggleFolderNav}
              onCreateNewFolder={this.props.toggleCreateFolderModal}/>
        </div>
        <div id="messaging-content">
          {this.props.children}
        </div>
        <ModalCreateFolder
            cssClass="messaging-modal"
            folders={this.props.folders}
            id="messaging-create-folder"
            onClose={this.props.toggleCreateFolderModal}
            visible={this.props.modals.createFolder.visible}/>
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
    navExpanded: state.folders.ui.nav.expanded,
    modals: state.modals
  };
};

const mapDispatchToProps = {
  toggleCreateFolderModal,
  toggleFolderNav
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
