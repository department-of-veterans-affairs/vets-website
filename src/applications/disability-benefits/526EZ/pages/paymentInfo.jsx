import React from 'react';
import Raven from 'raven-js';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { apiRequest } from '../../../../platform/utilities/api';
import AsyncDisplayWidget from '../components/AsyncDisplayWidget';

import { srSubstitute, PaymentDescription } from '../helpers';

const accountTitleLabels = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  NOBANK: 'No Bank Account'
};

const NOBANK = 'NOBANK';

export const viewComponent = (response) => {
  const {
    accountType,
    accountNumber,
    financialInstitutionRoutingNumber: routingNumber,
    financialInstitutionName: bankName,
  } = response;
  let accountNumberString;
  let routingNumberString;
  let bankNameString;
  const mask = (string, unmaskedLength) => {
    const maskedString = srSubstitute(`${'●'.repeat(string.length - unmaskedLength)}`, 'ending with');
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
    bankNameString = <p>Bank name: {bankName}</p>;
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
      <p>
        <strong>Note:</strong> If you need to update your bank information, please call Veterans Benefits Assistance
        at <a href="tel:+18008271000">1-800-827-1000</a>, Monday – Friday, 8:00 a.m. to 9:00 p.m. (ET).
      </p>
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
