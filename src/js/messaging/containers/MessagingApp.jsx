import React from 'react';
import { connect } from 'react-redux';

import { fetchFolders } from '../actions/folders';

class MessagingApp extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchFolders());
  }

  render() {
    return (
      <div id="messaging-app" className="row">
        <div id="messaging-app-header">
          <h1>Message your health care team</h1>
        </div>
        {this.props.children}
      </div>
    );
  }
}

MessagingApp.propTypes = {
  children: React.PropTypes.node
};

export default connect()(MessagingApp);
