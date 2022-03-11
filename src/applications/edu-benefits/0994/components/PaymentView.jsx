import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { maskBankInformation, hasNewBankInformation } from '../utils';

export const accountTitleLabels = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  NOBANK: 'No Bank Account',
};

const directDepositAlert = (
  <p>
    Thank you for providing your direct deposit information.{' '}
    <strong>This new account won’t be updated right away.</strong> We’ll deposit
    your housing stipend into this account if your VET TEC application is
    approved.
  </p>
);

export const PaymentView = ({ formData = {}, originalData = {} }) => {
  const bankAccount = _.get(formData, 'bankAccount', {});
  const {
    accountType: newAccountType,
    accountNumber: newAccountNumber,
    routingNumber: newRoutingNumber,
  } = bankAccount;

  const hasNewBankAccountInfo = hasNewBankInformation(bankAccount);
  const hasOriginalBankAccountInfo =
    originalData.bankAccountType !== undefined ||
    originalData.bankAccountType !== null;

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
      {(hasNewBankAccountInfo || hasOriginalBankAccountInfo) && (
        <p className="vads-u-margin-top--0">
          This is the bank account information we have on file for you. We’ll
          send your housing payment to this account.
        </p>
      )}
      <div className="blue-bar-block">
        <p>
          <strong>
            {accountTitleLabels[(bankAccountType || '').toUpperCase()]}
          </strong>
        </p>
        <p>Account number: {maskBankInformation(bankAccountNumber, 4)}</p>
        <p>Bank routing number: {maskBankInformation(bankRoutingNumber, 4)}</p>
      </div>
      <AlertBox
        isVisible={hasNewBankAccountInfo}
        status="success"
        content={directDepositAlert}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  originalData: state.form.data.prefillBankAccount,
});

export default connect(mapStateToProps)(PaymentView);
