import React from 'react';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import environment from 'platform/utilities/environment';
import * as BUCKETS from 'site/constants/buckets';
import * as ENVIRONMENTS from 'site/constants/environments';

import DirectDepositField from '../../../../components/DirectDepositField';
import DirectDepositViewField from '../../../../components/DirectDepositViewField';
import ObfuscateReviewField from '../../../../components/ObfuscateReviewField';

import {
  validateBankAccountNumber,
  validateRoutingNumber,
} from '../../../../utils/validation';

const checkImageSrc = (() => {
  const bucket = environment.isProduction()
    ? BUCKETS[ENVIRONMENTS.VAGOVPROD]
    : BUCKETS[ENVIRONMENTS.VAGOVSTAGING];

  return `${bucket}/img/check-sample.png`;
})();

const directDeposit33 = {
  uiSchema: {
    'view:directDeposit': {
      'ui:title': 'Direct deposit information',
      'ui:field': DirectDepositField,
      'ui:options': {
        hideLabelText: true,
        showFieldLabel: false,
        viewComponent: DirectDepositViewField,
        volatileData: true,
      },
      'ui:description': (
        <p>
          <strong>Note:</strong> We make payments only through direct deposit,
          also called electronic funds transfer (EFT).
        </p>
      ),
      bankAccount: {
        ...bankAccountUI,
        'ui:order': [
          'accountType',
          'routingNumber',
          'routingNumberConfirmation',
          'accountNumber',
          'accountNumberConfirmation',
        ],
        routingNumber: {
          ...bankAccountUI.routingNumber,
          'ui:errorMessages': {
            pattern: 'Please enter a valid 9-digit routing number',
          },
          'ui:reviewField': ObfuscateReviewField,
          'ui:validations': [
            validateRoutingNumber,
            (errors, fieldData, formData) => {
              const accountNumber =
                formData['view:directDeposit']?.bankAccount?.accountNumber;
              if (fieldData && accountNumber && fieldData === accountNumber) {
                errors.addError(
                  'Your bank routing number and bank account number cannot match',
                );
              }
            },
          ],
        },
        routingNumberConfirmation: {
          'ui:title': 'Confirm bank routing number',
          'ui:required': formData =>
            formData?.mebBankInfoConfirmationField === true,
          'ui:options': {
            hideIf: formData => formData?.mebBankInfoConfirmationField !== true,
          },
          'ui:errorMessages': {
            pattern: 'Please enter a valid 9-digit routing number',
          },
          'ui:reviewField': ObfuscateReviewField,
          'ui:validations': [
            (errors, fieldData, formData) => {
              if (formData?.mebBankInfoConfirmationField === true) {
                const routingNumber =
                  formData['view:directDeposit']?.bankAccount?.routingNumber;
                if (fieldData && routingNumber && fieldData !== routingNumber) {
                  errors.addError('Your bank routing number must match');
                }
              }
            },
          ],
        },
        accountNumber: {
          ...bankAccountUI.accountNumber,
          'ui:errorMessages': {
            pattern: 'Please enter a valid 5-17 digit bank account number',
          },
          'ui:reviewField': ObfuscateReviewField,
          'ui:validations': [
            validateBankAccountNumber,
            (errors, fieldData, formData) => {
              const routingNumber =
                formData['view:directDeposit']?.bankAccount?.routingNumber;
              if (fieldData && routingNumber && fieldData === routingNumber) {
                errors.addError(
                  'Your bank routing number and bank account number cannot match',
                );
              }
            },
          ],
        },
        accountNumberConfirmation: {
          'ui:title': 'Confirm bank account number',
          'ui:required': formData =>
            formData?.mebBankInfoConfirmationField === true,
          'ui:options': {
            hideIf: formData => formData?.mebBankInfoConfirmationField !== true,
          },
          'ui:errorMessages': {
            pattern: 'Please enter a valid 5-17 digit bank account number',
          },
          'ui:reviewField': ObfuscateReviewField,
          'ui:validations': [
            (errors, fieldData, formData) => {
              if (formData?.mebBankInfoConfirmationField === true) {
                const accountNumber =
                  formData['view:directDeposit']?.bankAccount?.accountNumber;
                if (fieldData && accountNumber && fieldData !== accountNumber) {
                  errors.addError('Your bank account number must match');
                }
              }
            },
          ],
        },
      },
    },
    'view:learnMore': {
      'ui:description': (
        <va-additional-info
          key="learn-more-btn"
          trigger="Where can I find these numbers?"
        >
          <img
            key="check-image-src"
            style={{ marginTop: '0.625rem' }}
            src={checkImageSrc}
            alt="Example of a check showing where the account and routing numbers are"
          />
          <br />
          <br />

          <p key="learn-more-description">
            The bank routing number is the first 9 digits on the bottom left
            corner of a printed check. Your account number is the second set of
            numbers on the bottom of a printed check, just to the right of the
            bank routing number.
          </p>
          <br />
          <p key="learn-more-additional">
            If you don’t have a printed check, you can sign in to your online
            banking institution for this information
          </p>
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:directDeposit': {
        type: 'object',
        properties: {
          bankAccount: {
            type: 'object',
            required: ['accountType', 'accountNumber', 'routingNumber'],
            properties: {
              accountType: {
                type: 'string',
                enum: ['Checking', 'Savings'],
              },
              routingNumber: {
                type: 'string',
                pattern: '^[\\d*]{5}\\d{4}$',
              },
              routingNumberConfirmation: {
                type: 'string',
                pattern: '^[\\d*]{5}\\d{4}$',
              },
              accountNumber: {
                type: 'string',
                pattern: '^[\\d*]{5,17}$',
              },
              accountNumberConfirmation: {
                type: 'string',
                pattern: '^[\\d*]{5,17}$',
              },
            },
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
