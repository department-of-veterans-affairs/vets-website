import React from 'react';
import { connect } from 'react-redux';

import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';

class MainMobile extends React.Component {
  render() {
    return (
      <div>
        <div id="messaging-nav">
          <ComposeButton/>
          <FolderNav
              folders={this.props.folders}
              expanded={this.props.navExpanded}
              onToggleFolders={this.props.toggleFolderNav}/>
        </div>
        <div id="messaging-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

MainMobile.propTypes = {
  children: React.PropTypes.node
};

const mapStateToProps = (state) => {
  return {
    folders: state.folders.data.items,
    navExpanded: state.folders.ui.nav.expanded
  };
};

export default connect(mapStateToProps)(MainMobile);
