import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '../../common/components/AlertBox';
import { closeAlert } from '../actions/alert.js';
import TabNav from '../components/TabNav';
import ErrorView from '../components/ErrorView';

class Main extends React.Component {
  render() {
    return (
      <ErrorView errors={this.props.errors}>
        <div>
          <AlertBox
              content={this.props.alert.content}
              isVisible={this.props.alert.visible}
              onCloseAlert={this.props.closeAlert}
              scrollOnShow
              status={this.props.alert.status}/>
          <h1>Prescription Refill</h1>
          <TabNav/>
          {this.props.children}
        </div>
      </ErrorView>
    );
  }
}

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  return {
    alert: rxState.alert,
    errors: rxState.errors,
  };
};

const mapDispatchToProps = {
  closeAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
