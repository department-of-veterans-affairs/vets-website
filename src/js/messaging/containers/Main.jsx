import React from 'react';
import { connect } from 'react-redux';

import ComposeButton from '../components/ComposeButton';
import FolderNav from '../components/FolderNav';

class Main extends React.Component {
  render() {
    const folders = this.props.folders.items;

    return (
      <div>
        <div id="main-nav">
          <ComposeButton/>
          <FolderNav folders={folders}/>
        </div>
        <div id="main-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  children: React.PropTypes.node
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Main);
