import React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { accountTitleLabels } from '../constants';
import { srSubstitute, viewifyFields } from '../utils';

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

const accountsDifferContent = (
  <p>
    We’ll add this new bank account to your disability application.{' '}
    <strong>
      This new account won’t be updated in all VA systems right away.
    </strong>{' '}
    Your current payments will continue to be deposited into the previous
    account we showed.
  </p>
);

export const PaymentView = ({ formData = {}, originalData = {} }) => {
  const bankAccountType =
    formData.bankAccountType || originalData['view:bankAccountType'];
  const bankAccountNumber =
    formData.bankAccountNumber || originalData['view:bankAccountNumber'];
  const bankRoutingNumber =
    formData.bankRoutingNumber || originalData['view:bankRoutingNumber'];
  const bankName = formData.bankName || originalData['view:bankName'];

  const dataChanged = !isEqual(
    viewifyFields({
      bankAccountType,
      bankAccountNumber,
      bankRoutingNumber,
      bankName,
    }),
    originalData,
  );

  return (
    <div>
      {!dataChanged && (
        <p>We’re currently paying your compensation to this account</p>
      )}
      <div className="blue-bar-block">
        <p>
          <strong>
            {accountTitleLabels[(bankAccountType || '').toUpperCase()]}
          </strong>
        </p>
        <p>Account number: {mask(bankAccountNumber, 4)}</p>
        <p>Bank routing number: {mask(bankRoutingNumber, 4)}</p>
        <p>Bank name: {bankName || srSubstitute('', 'is blank')}</p>
      </div>
      {dataChanged && (
        <AlertBox isVisible status="warning" content={accountsDifferContent} />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  originalData: state.form.data['view:originalBankAccount'],
});

export default connect(mapStateToProps)(PaymentView);
