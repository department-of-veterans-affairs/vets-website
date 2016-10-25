import React from 'react';
import { connect } from 'react-redux';

import { closeAlert } from '../actions/alert.js';
import { closeDisclaimer } from '../actions/disclaimer.js';

import AlertBox from '../../common/components/AlertBox';
import TabNav from '../components/TabNav';
import Disclaimer from '../components/Disclaimer';

import RequiredLoginView from '../../common/components/RequiredLoginView';
import RequiredVerifyView from '../../common/components/RequiredVerifyView';

class Main extends React.Component {
  render() {
    let alertBox;
    let view;

    if (this.props.alert.visible) {
      alertBox = (
        <AlertBox
            content={this.props.alert.content}
            isVisible={this.props.alert.visible}
            onCloseAlert={this.props.closeAlert}
            status={this.props.alert.status}/>
      );
    }

    if (localStorage.length > 0) {
      if (this.props.profile.accountType === 1) {
        view = (<RequiredVerifyView/>);
      } else {
        view = (
          <div>
            <Disclaimer
                isOpen={this.props.disclaimer.open}
                handleClose={this.props.closeDisclaimer}/>
            <div className="rx-app row">
              {alertBox}
              <h1>Prescription Refill</h1>
              <TabNav/>
              {this.props.children}
            </div>
          </div>
        );
      }
    } else {
      view = (<RequiredLoginView authRequired={1}/>);
    }
    return view;
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, {
  closeAlert,
  closeDisclaimer
})(Main);
