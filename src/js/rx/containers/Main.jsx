import React from 'react';
import { connect } from 'react-redux';

import { closeAlert } from '../actions/alert.js';

import AlertBox from '../../common/components/AlertBox';
import TabNav from '../components/TabNav';

class Main extends React.Component {
  render() {
    let alertBox;

    if (this.props.alert.visible) {
      alertBox = (
        <AlertBox
            content={this.props.alert.content}
            isVisible={this.props.alert.visible}
            onCloseAlert={this.props.closeAlert}
            status={this.props.alert.status}/>
      );
    }

    return (
      <div>
        <div className="rx-app row">
          {alertBox}
          <h1>Prescription Refill</h1>
          <TabNav/>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, {
  closeAlert,
})(Main);
