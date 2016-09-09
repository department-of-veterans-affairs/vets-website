import React from 'react';
import { connect } from 'react-redux';

import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';

class Modal extends React.Component {
  render() {
    return (
      <div>
        <div id="main-nav">
          <ComposeButton/>
          <FolderNav folders={this.props.folders}/>
        </div>
        <div id="main-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  children: React.PropTypes.node
};

const mapStateToProps = (state) => {
  return {
    folders: state.folders.items
  };
};

export default connect(mapStateToProps)(Modal);
