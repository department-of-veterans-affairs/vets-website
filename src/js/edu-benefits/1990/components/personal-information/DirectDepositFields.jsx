import React from 'react';

import ErrorableTextInput from '../../../../common/components/form-elements/ErrorableTextInput';
import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';
import { validateIfDirty, isBlank } from '../../../../common/utils/validations';

import { accountTypes } from '../../utils/options-for-select';
import { isValidRoutingNumber } from '../../utils/validations';

export default class DirectDepositFields extends React.Component {
  render() {
    return (
      <fieldset>
        <legend>Direct deposit</legend>
        <p>VA makes payments only through direct deposit, also called electronic funds transfer (EFT). The only exception is for participants in the Post-Vietnam Era Veterans' Educational Assistance Program (VEAP).</p>
        <p>If you don’t have a bank account, VA will pay you through the Direct Express® Debit MasterCard®. Apply for a Direct Express® Debit MasterCard® at <a href="https://www.usdirectexpress.com/">www.usdirectexpress.com</a> or by calling 1-800-333-1795. To request a waiver, contact the Department of Treasury Electronic Solution Center at 1-888-224-2950.</p>
        <p><span className="form-required-span">*</span>Indicates a required field</p>
        <div className="input-section">
          <ErrorableRadioButtons
              label="Account type"
              name="accountType"
              options={accountTypes}
              value={this.props.data.bankAccount.accountType}
              onValueChange={(update) => {this.props.onStateChange('bankAccount.accountType', update);}}/>
          <ErrorableTextInput
              label="Account number"
              name="accountNumber"
              field={this.props.data.bankAccount.accountNumber}
              onValueChange={(update) => {this.props.onStateChange('bankAccount.accountNumber', update);}}/>
          <ErrorableTextInput
              errorMessage={validateIfDirty(this.props.data.bankAccount.routingNumber, (val) => isBlank(val) || isValidRoutingNumber(val)) ? undefined : 'Please enter a valid nine digit routing number'}
              validation={isValidRoutingNumber(this.props.data.bankAccount.routingNumber)}
              label="Routing number"
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
