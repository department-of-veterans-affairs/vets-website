import React from 'react';
import { connect } from 'react-redux';

import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';

class Main extends React.Component {
  render() {
    return (
      <div>
        <div id="messaging-nav">
          <ComposeButton/>
          <FolderNav folders={this.props.folders}/>
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
    folders: state.folders.items
  };
};

export default connect(mapStateToProps)(Main);
