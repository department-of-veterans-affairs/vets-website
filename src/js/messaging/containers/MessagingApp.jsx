import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '../../common/components/AlertBox';
import { closeAlert } from '../actions/alert.js';
import { fetchFolders } from '../actions/folders';

class MessagingApp extends React.Component {
  componentDidMount() {
    this.props.fetchFolders();
  }

  render() {
    return (
      <div id="messaging-app" className="row">
        <div id="messaging-app-header">
          <AlertBox
              content={this.props.alert.content}
              isVisible={this.props.alert.visible}
              onCloseAlert={this.props.closeAlert}
              status={this.props.alert.status}/>
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

const mapStateToProps = (state) => {
  return {
    alert: state.alert
  };
};

const mapDispatchToProps = {
  closeAlert,
  fetchFolders
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagingApp);
