import React from 'react';
import {
  radioUI,
  textUI,
  radioSchema,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

function IntroAlert() {
  return (
    <div className="vads-u-margin-bottom--3">
      <va-alert>
        <h4 slot="headline" className="vads-u-font-size--h4">
          We’ll use this bank account for all your VA benefit payments
        </h4>
        <p className="vads-u-margin-y--0">
          If we approve your application for pension benefits, we’ll update
          direct deposit information for all your VA benefit payments. We’ll
          deposit any payments you may receive for pension or education benefits
          directly into the bank account you provide here.
        </p>
        <p>
          We’re making this change to help protect you from fraud and to make
          sure we can pay you on time, every time, without error.
        </p>
      </va-alert>
    </div>
  );
}

function dependsIfHasBankAccount(formData) {
  return (
    formData?.hasBankAccount === true ||
    formData?.hasBankAccount === 'Y' ||
    formData?.hasBankAccount === 'yes'
  );
}

const uiSchema = {
  'ui:title': 'Account information for direct deposit',
  'ui:description': IntroAlert,
  accountType: radioUI({
    title: 'Account type',
    classNames: 'vads-u-margin-bottom--2',
    labels: { CHECKING: 'Checking', SAVINGS: 'Savings' },
  }),
  bankName: textUI('Bank name'),
  accountNumber: textUI('Account number'),
  routingNumber: textUI('Routing number'),
};

const schema = {
  type: 'object',
  required: ['accountType', 'accountNumber', 'routingNumber'],
  properties: {
    accountType: radioSchema(['CHECKING', 'SAVINGS']),
    bankName: textSchema,
    accountNumber: textSchema,
    routingNumber: textSchema,
  },
};

export default {
  depends: dependsIfHasBankAccount,
  uiSchema,
  schema,
};
