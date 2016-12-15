import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '../../common/components/AlertBox';
import { closeAlert } from '../actions/alert.js';
import TabNav from '../components/TabNav';

class Main extends React.Component {
  render() {
    return (
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    alert: state.alert
  };
};

const mapDispatchToProps = {
  closeAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
