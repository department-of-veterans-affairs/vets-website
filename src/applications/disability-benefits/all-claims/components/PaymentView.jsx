import React from 'react';
import { srSubstitute } from '../utils';
import { NOBANK, accountTitleLabels } from '../constants';
import { PaymentDescription, editNote } from '../content/paymentInformation';

const PaymentView = response => {
  const {
    accountType = '',
    accountNumber = '',
    financialInstitutionRoutingNumber: routingNumber = '',
    financialInstitutionName: bankName = '',
  } = response;
  let accountNumberString;
  let routingNumberString;
  let bankNameString;

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

  if (accountType !== NOBANK) {
    accountNumberString = <p>Account number: {mask(accountNumber, 4)}</p>;
    routingNumberString = <p>Bank routing number: {mask(routingNumber, 4)}</p>;
    bankNameString = (
      <p>Bank name: {bankName || srSubstitute('', 'is blank')}</p>
    );
  }
  return (
    <div>
      <PaymentDescription />
      <div className="blue-bar-block">
        <p>
          <strong>{accountTitleLabels[accountType.toUpperCase()]}</strong>
        </p>
        {accountNumberString}
        {routingNumberString}
        {bankNameString}
      </div>
      {editNote('bank information')}
    </div>
  );
};

export default PaymentView;
