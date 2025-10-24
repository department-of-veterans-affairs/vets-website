import React from 'react';
import {
  radioUI,
  textUI,
  radioSchema,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

// Simple page to collect whether applicant has a bank account for direct deposit
const Description = () => (
  <div>
    <p>
      Enter the details of the bank account where you want to get your VA
      benefit payments.
    </p>
  </div>
);

function dependsIfHasBankAccount(formData) {
  return (
    formData?.hasBankAccount === true ||
    formData?.hasBankAccount === 'Y' ||
    formData?.hasBankAccount === 'yes'
  );
}

const uiSchema = {
  'ui:title': 'Account information for direct deposit',
  'ui:description': Description,
  accountType: radioUI({
    title: 'Account type',
    classNames: 'vads-u-margin-bottom--2',
    labels: { CHECKING: 'Checking', SAVINGS: 'Savings' },
  }),
  bankName: textUI('Bank name'),
  accountNumber: textUI('Bank account number'),
  routingNumber: textUI("Bank's 9-digit routing number"),
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
