import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';

import { accountTypes } from '../../utils/options-for-select';
import { validateIfDirty, isValidRoutingNumber } from '../../utils/validations';

export default class DirectDepositFields extends React.Component {
  render() {
    return (
      <fieldset>
        <legend>Direct Deposit</legend>
        <div className="input-section">
          <ErrorableRadioButtons
              label="Account Type"
              name="accountType"
              options={accountTypes}
              value={this.props.data.bankAccount.accountType}
              onValueChange={(update) => {this.props.onStateChange('bankAccount.accountType', update);}}/>
          <ErrorableTextInput
              label="Account Number"
              name="accountNumber"
              field={this.props.data.bankAccount.accountNumber}
              onValueChange={(update) => {this.props.onStateChange('bankAccount.accountNumber', update);}}/>
          <ErrorableTextInput
              errorMessage={validateIfDirty(this.props.data.bankAccount.routingNumber, isValidRoutingNumber) ? undefined : 'Please enter a valid nine digit routing number'}
              validation={isValidRoutingNumber(this.props.data.bankAccount.routingNumber)}
              label="Routing Number"
              name="routingNumber"
              field={this.props.data.bankAccount.routingNumber}
              onValueChange={(update) => {this.props.onStateChange('bankAccount.routingNumber', update);}}/>
        </div>
      </fieldset>
    );
  }
}

DirectDepositFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
