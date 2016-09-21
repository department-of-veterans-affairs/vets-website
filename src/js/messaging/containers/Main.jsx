import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { toggleFolderNav, toggleManagedFolders } from '../actions/folders';
import ButtonClose from '../components/buttons/ButtonClose';
import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';

class Main extends React.Component {
  render() {
    const navClass = classNames({
      opened: this.props.navIsVisible
    });

    return (
      <div id="messaging-main">
        <div id="messaging-nav" className={navClass}>
          <ButtonClose
              className="messaging-folder-nav-close"
              onClick={this.props.toggleFolderNav}/>
          <ComposeButton/>
          <FolderNav
              folders={this.props.folders}
              isExpanded={this.props.navIsExpanded}
              onToggleFolders={this.props.toggleManagedFolders}/>
        </div>
        <div id="messaging-content">
          {this.props.children}
        </div>
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
    navIsExpanded: state.folders.ui.nav.expanded,
    navIsVisible: state.folders.ui.nav.visible
  };
};

const mapDispatchToProps = {
  toggleFolderNav,
  toggleManagedFolders
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
