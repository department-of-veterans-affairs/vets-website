import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { srSubstitute } from '../utils';

export const accountTitleLabels = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  NOBANK: 'No Bank Account',
};

const mask = (string, unmaskedLength) => {
  // If no string is given, tell the screen reader users the account or routing number is blank
  if (!string) {
    return srSubstitute('', 'is blank');
  }
  const repeatCount =
    string.length > unmaskedLength ? string.length - unmaskedLength : 0;
  const maskedString = srSubstitute(
    `${'●'.repeat(repeatCount)}`,
    'ending with',
  );
  return (
    <span>
      {maskedString}
      {string.slice(-unmaskedLength)}
    </span>
  );
};

export const PaymentView = ({ formData = {}, originalData = {} }) => {
  const {
    accountType: newAccountType,
    accountNumber: newAccountNumber,
    routingNumber: newRoutingNumber,
  } = _.get(formData, 'bankAccount', {});

  const hasNewBankAccountInfo =
    newAccountType || newAccountNumber || newRoutingNumber;

  const bankAccountType = hasNewBankAccountInfo
    ? newAccountType
    : originalData.bankAccountType;
  const bankAccountNumber = hasNewBankAccountInfo
    ? newAccountNumber
    : originalData.bankAccountNumber;
  const bankRoutingNumber = hasNewBankAccountInfo
    ? newRoutingNumber
    : originalData.bankRoutingNumber;

  return (
    <div>
      <div className="blue-bar-block">
        <p>
          <strong>
            {accountTitleLabels[(bankAccountType || '').toUpperCase()]}
          </strong>
        </p>
        <p>Account number: {mask(bankAccountNumber, 4)}</p>
        <p>Bank routing number: {mask(bankRoutingNumber, 4)}</p>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  originalData: state.form.data.prefillBankAccount,
});

export default connect(mapStateToProps)(PaymentView);
