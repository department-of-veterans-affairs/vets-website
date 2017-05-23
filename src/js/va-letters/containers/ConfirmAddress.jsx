import React from 'react';
import { connect } from 'react-redux';

import { updateAddressConfirmation } from '../actions';

import ProgressButton from '../../common/components/form-elements/ProgressButton';

class ConfirmAddress extends React.Component {
  constructor(props) {
    super(props);
    this.confirmAddress = this.confirmAddress.bind(this);
  }

  confirmAddress() {
    this.props.onAddressConfirmation(true);
    this.props.router.push('/download-letters');
  }

  render() {
    const buttons = this.props.isAddressConfirmed !== false ?
        (<div className="form-progress-buttons">
          <div className="small-6 medium-3 columns">
            <ProgressButton
                onButtonClick={this.confirmAddress}
                buttonText="Yes"
                buttonClass="usa-button-primary"/>
          </div>
          <div className="small-6 medium-3 end columns">
            <ProgressButton
                onButtonClick={() => this.props.onAddressConfirmation(false)}
                buttonText="No"
                buttonClass="usa-button-outline"/>
          </div>
        </div>) : null;

    const alert = this.props.isAddressConfirmed === false ?
        (<div className="usa-alert usa-alert-warning">
          <div className="usa-alert-body">
            <h4 className="usa-alert-heading">Your address on file is incorrect</h4>
            <p>You've told us that the address we have on file for you is incorrect.</p>
            <p>Since we do not have the correct address, we cannot show you your VA Letters at this time.</p>
            <p>To update your address, please call the Vets.gov Help Desk at 1-855-574-7286 (TTY: 1-800-829-4833), Monday - Friday, 8:00am - 8:00pm ET., or visit this link.</p>
          </div>
        </div>) : null;

    return (
      <div className="letters-form-panel">
        <p>The address on file for you with VA Compensation and Pension is:</p>
        <p>
          <span>Jamie J. Wood</span><br/>
          <span>3345 Hsd St.</span><br/>
          <span>Hyderabad, INDIA</span>
        </p>
        <label><strong>Is this address correct?</strong></label>
        {buttons}
        {alert}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const isAddressConfirmed = state.vaLetters.letters.isAddressConfirmed;
  return {
    isAddressConfirmed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAddressConfirmation: (value) => {
      dispatch(updateAddressConfirmation(value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ConfirmAddress);
