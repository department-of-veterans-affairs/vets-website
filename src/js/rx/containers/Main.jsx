import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '../../common/components/AlertBox';
import { closeDisclaimer } from '../actions/disclaimer';
import { closeAlert } from '../actions/alert.js';
import Disclaimer from '../components/Disclaimer';
import ErrorView from '../components/ErrorView';
import TabNav from '../components/TabNav';

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
          <Disclaimer
              isOpen={this.props.disclaimer.open}
              handleClose={this.props.closeDisclaimer}/>
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
    disclaimer: rxState.disclaimer,
    errors: rxState.errors.errors,
  };
};

const mapDispatchToProps = {
  closeAlert,
  closeDisclaimer,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
