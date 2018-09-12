import React from 'react';
import Raven from 'raven-js';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { apiRequest } from '../../../../platform/utilities/api';
import AsyncDisplayWidget from '../components/AsyncDisplayWidget';

import { srSubstitute, PaymentDescription, editNote } from '../helpers';

const accountTitleLabels = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  NOBANK: 'No Bank Account'
};

const NOBANK = 'NOBANK';

export const viewComponent = (response) => {
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
    const repeatCount = string.length > unmaskedLength ? string.length - unmaskedLength : 0;
    const maskedString = srSubstitute(`${'●'.repeat(repeatCount)}`, 'ending with');
    return <span>{maskedString}{string.slice(-unmaskedLength)}</span>;
  };

  if (accountType !== NOBANK) {
    accountNumberString = (
      <p>
        Account number: {mask(accountNumber, 4)}
      </p>
    );
    routingNumberString = (
      <p>
        Bank routing number: {mask(routingNumber, 4)}
      </p>
    );
    bankNameString = <p>Bank name: {bankName || srSubstitute('', 'is blank')}</p>;
  }
  return (
    <div>
      <PaymentDescription/>
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

const failureComponent = () => (
  <AlertBox
    headline="We can’t access your information"
    content="We’re sorry. We can’t access your payment information right now. You can continue to fill out the form and we’ll try again later."
    status="error"
    className="async-display-widget-alert-box"
    isVisible/>
);

function fetchPaymentInformation() {
  return apiRequest('/ppiu/payment_information',
    {},
    response => {
      // Return only the bit the UI cares about
      return response.data.attributes.responses[0].paymentAccount;
    },
    () => {
      Raven.captureMessage('vets_payment_information_fetch_failure');
      return Promise.reject();
    }
  );
}

export const uiSchema = {
  'ui:title': 'Payment information',
  'ui:field': 'StringField',
  'ui:widget': AsyncDisplayWidget,
  'ui:options': {
    callback: fetchPaymentInformation,
    viewComponent,
    failureComponent
  }
};

export const schema = {
  type: 'object',
  properties: {}
};
