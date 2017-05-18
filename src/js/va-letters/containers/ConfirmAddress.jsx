import React from 'react';
import { connect } from 'react-redux';

import { updateAddressConfirmation } from '../actions';

import ProgressButton from '../../common/components/form-elements/ProgressButton';

class ConfirmAddress extends React.Component {
  render() {
    return (
      <div>
        <p>The address on file for you with VA Compensation and Pension is:</p>
        <p>
          <span>Jamie J. Wood</span><br/>
          <span>3345 Hsd St.</span><br/>
          <span>Hyderabad, INDIA</span>
        </p>
        <label><strong>Is this address correct?</strong></label>
        <div className="usa-grid form-progress-buttons">
          <div className="small-6 medium-2 columns">
            <ProgressButton
                onButtonClick={() => this.props.onConfirmationOfAddress(true)}
                buttonText="Yes"
                buttonClass="usa-button-primary"/>
          </div>
          <div className="small-6 medium-2 end columns">
            <ProgressButton
                onButtonClick={() => this.props.onConfirmationOfAddress(false)}
                buttonText="No"
                buttonClass="usa-button-outline"/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    profile: userState.profile
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onConfirmationOfAddress: (value) => {
      dispatch(updateAddressConfirmation(value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ConfirmAddress);
