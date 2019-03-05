import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { maskBankInformation, hasNewBankInformation } from '../utils';

export const accountTitleLabels = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  NOBANK: 'No Bank Account',
};

export const PaymentView = ({ formData = {}, originalData = {} }) => {
  const bankAccount = _.get(formData, 'bankAccount', {});
  const {
    accountType: newAccountType,
    accountNumber: newAccountNumber,
    routingNumber: newRoutingNumber,
  } = bankAccount;

  const hasNewBankAccountInfo = hasNewBankInformation(bankAccount);

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
        <p>Account number: {maskBankInformation(bankAccountNumber, 4)}</p>
        <p>Bank routing number: {maskBankInformation(bankRoutingNumber, 4)}</p>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  originalData: state.form.data.prefillBankAccount,
});

export default connect(mapStateToProps)(PaymentView);
