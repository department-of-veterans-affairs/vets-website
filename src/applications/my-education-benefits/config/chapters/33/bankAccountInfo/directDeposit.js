import React from 'react';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import environment from 'platform/utilities/environment';

import * as BUCKETS from 'site/constants/buckets';
import * as ENVIRONMENTS from 'site/constants/environments';

import { customDirectDepositDescription } from '../../../../helpers';

const isValidAccountNumber = accountNumber => {
  if (/^[0-9]*$/.test(accountNumber)) {
    return accountNumber;
  }
  return false;
};

const validateAccountNumber = (
  errors,
  accountNumber,
  formData,
  schema,
  errorMessages,
) => {
  if (
    !isValidAccountNumber(accountNumber) &&
    !formData.showDgiDirectDeposit1990EZ
  ) {
    errors.addError(errorMessages.pattern);
  }
};

const checkImageSrc = (() => {
  const bucket = environment.isProduction()
    ? BUCKETS[ENVIRONMENTS.VAGOVPROD]
    : BUCKETS[ENVIRONMENTS.VAGOVSTAGING];

  return `${bucket}/img/check-sample.png`;
})();

const directDeposit33 = {
  uiSchema: {
    'ui:description': customDirectDepositDescription,
    bankAccount: {
      ...bankAccountUI,
      'ui:order': ['accountType', 'routingNumber', 'accountNumber'],
      accountNumber: {
        'ui:title': 'Bank account number',
        'ui:validations': [validateAccountNumber],
        'ui:errorMessages': {
          pattern: 'Please enter only numbers',
        },
      },
    },
    'view:learnMore': {
      'ui:description': (
        <>
          <img
            key="check-image-src"
            style={{ marginTop: '0.625rem' }}
            src={checkImageSrc}
            alt="Example of a check showing where the account and routing numbers are"
          />
          <p key="learn-more-title">Where can I find these numbers?</p>
          <p key="learn-more-description">
            The bank routing number is the first 9 digits on the bottom left
            corner of a printed check. Your account number is the second set of
            numbers on the bottom of a printed check, just to the right of the
            bank routing number.
          </p>
          <va-additional-info key="learn-more-btn" trigger="Learn More">
            <p key="btn-copy">
              If you don’t have a printed check, you can sign in to your online
              banking institution for this information
            </p>
          </va-additional-info>
        </>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      bankAccount: {
        type: 'object',
        required: ['accountType', 'routingNumber', 'accountNumber'],
        properties: {
          accountType: {
            type: 'string',
            enum: ['Checking', 'Savings'],
          },
          routingNumber: {
            type: 'string',
            pattern: '^\\d{9}$',
          },
          accountNumber: {
            type: 'string',
          },
        },
      },
      'view:learnMore': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default directDeposit33;
