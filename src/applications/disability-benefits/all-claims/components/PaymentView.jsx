import React from 'react';
import { connect } from 'react-redux';
import { isEqual, isEmpty } from 'lodash';

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

function accountsDifferContent(originalDataIsEmpty) {
  return (
    <p className="vads-u-font-size--base vads-u-margin-top--0">
      We’ll add this new bank account to your claim for disability compensation.{' '}
      <strong>
        This new account won’t be updated in all VA systems right away.
      </strong>{' '}
      {!originalDataIsEmpty && (
        <>
          Your current payments will continue to be deposited into the previous
          account we showed.
        </>
      )}
    </p>
  );
}

export const PaymentView = ({ formData = {}, originalData = {} }) => {
  const getBankData = name =>
    formData[name] ||
    formData['view:originalBankAccount']?.[`view:${name}`] ||
    originalData[`view:${name}`];

  const bankAccountType = getBankData('bankAccountType');
  const bankAccountNumber = getBankData('bankAccountNumber');
  const bankRoutingNumber = getBankData('bankRoutingNumber');
  const bankName = getBankData('bankName');

  const dataChanged = !isEqual(
    viewifyFields({
      bankAccountType,
      bankAccountNumber,
      bankRoutingNumber,
      bankName,
    }),
    originalData,
  );

  const originalDataIsEmpty = isEmpty(originalData);

  return (
    <>
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
        <va-alert visible status="warning">
          {accountsDifferContent(originalDataIsEmpty)}
        </va-alert>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  originalData: state.form.data['view:originalBankAccount'],
});

export default connect(mapStateToProps)(PaymentView);
