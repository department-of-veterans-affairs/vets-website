import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import Phone from '../../../common/components/questions/Phone';
import Address from '../../../common/components/questions/Address';

export default class DirectDepositFields extends React.Component {
  render() {
    return (
      <fieldset>
        <legend>Secondary Contact</legend>
        <div className="input-section">
          <ErrorableTextInput
              label="Name"
              name="DirectDepositName"
              field={this.props.data.DirectDeposit.fullName}
              onValueChange={(update) => {this.props.onStateChange('DirectDeposit.fullName', update);}}/>
          <Phone
              label="Telephone number"
              name="DirectDepositPhone"
              value={this.props.data.DirectDeposit.phone}
              onValueChange={(update) => {this.props.onStateChange('DirectDeposit.phone', update);}}/>
        </div>
        <div className="input-section">
          <h4>Address</h4>
          <ErrorableCheckbox
              label="Address for secondary contact is the same as mine."
              name="DirectDepositSameAddress"
              checked={this.props.data.DirectDeposit.sameAddress}
              onValueChange={(update) => {this.props.onStateChange('DirectDeposit.sameAddress', update);}}/>
          {!this.props.data.DirectDeposit.sameAddress
            ? <Address
                value={this.props.data.DirectDeposit.address}
                onUserInput={(update) => {this.props.onStateChange('DirectDeposit.address', update);}}/>
            : null}
        </div>
      </fieldset>
    );
  }
}

DirectDepositFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
