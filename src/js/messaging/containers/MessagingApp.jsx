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
        <h1>Message your health care team</h1>
        <p>
          <strong>Important:</strong> Secure messaging is not instantly read.
          It can take up to 2 hours for a message to be seen
          and/or a response to be sent.
        </p>
        {this.props.children}
      </div>
    );
  }
}

MessagingApp.propTypes = {
  children: React.PropTypes.node
};

export default connect()(MessagingApp);
