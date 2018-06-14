import React from 'react';
import Raven from 'raven-js';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { apiRequest } from '../../../../platform/utilities/api';
import AsyncDisplayWidget from '../components/AsyncDisplayWidget';

import { srSubstitute } from '../helpers';

export const accountLabels = {
  CHECKING: 'Checking account',
  SAVINGS: 'Savings account',
  NOBANK: 'I don’t have a bank account'
};

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
        Routing number: {mask(routingNumber, 4)}
      </p>
    );
    bankNameString = <p>Bank name: {bankName}</p>;
  }
  return (
    <div>
      <p>
        This is the bank account that we have on file for you. It’s used to pay both Disability and Pension benefits.
      </p>
      <div className="blue-bar-block">
        <p>
          <strong>{accountTitleLabels[accountType]}</strong>
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
    headline="We can’t seem to find your information"
    content="That’s on us. Sorry about that."
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
