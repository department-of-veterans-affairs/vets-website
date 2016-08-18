import React from 'react';
import { connect } from 'react-redux';

import { closeAlert } from '../actions/alert.js';

import AlertBox from '../components/AlertBox';
import TabNav from '../components/TabNav';

class Main extends React.Component {
  render() {
    return (
      <div className="rx-app row">
        <AlertBox
            content={this.props.alert.content}
            isVisible={this.props.alert.visible}
            onCloseAlert={this.props.closeAlert}
            status={this.props.alert.status}/>
        <TabNav/>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, { closeAlert })(Main);
