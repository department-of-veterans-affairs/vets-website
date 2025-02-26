import React from 'react';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import environment from 'platform/utilities/environment';
import * as BUCKETS from 'site/constants/buckets';
import * as ENVIRONMENTS from 'site/constants/environments';

import DirectDepositViewField from '../../../../components/DirectDepositViewField';
import ObfuscateReviewField from '../../../../components/ObfuscateReviewField';

import {
  validateBankAccountNumber,
  validateRoutingNumber,
} from '../../../../utils/validation';

const shouldStartInEditMode = formData => {
  const bankAccount = formData?.bankAccount;
  const hasData = [
    bankAccount?.accountType,
    bankAccount?.routingNumber,
    bankAccount?.accountNumber,
  ].some(field => field?.length > 0);
  // Return false to not start in edit mode if any data is present
  return !hasData;
};

const checkImageSrc = (() => {
  const bucket = environment.isProduction()
    ? BUCKETS[ENVIRONMENTS.VAGOVPROD]
    : BUCKETS[ENVIRONMENTS.VAGOVSTAGING];

  return `${bucket}/img/check-sample.png`;
})();

const preFilledDirectDeposit33 = {
  uiSchema: {
    'view:directDeposit': {
      'ui:title': (
        <h4 className="vads-u-font-size--h5 vads-u-margin-top--0">
          Direct deposit information
        </h4>
      ),
      'ui:field': ReviewCardField,
      'ui:options': {
        editTitle: 'Direct deposit information',
        hideLabelText: true,
        itemName: 'account information',
        itemNameAction: 'Update',
        reviewTitle: 'Direct deposit information',
        showFieldLabel: false,
        startInEdit: formData => shouldStartInEditMode(formData),
        // startInEdit: false,
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
        'ui:order': ['accountType', 'routingNumber', 'accountNumber'],
        routingNumber: {
          ...bankAccountUI.routingNumber,
          'ui:errorMessages': {
            pattern: 'Please enter a valid 9-digit routing number',
          },
          'ui:reviewField': ObfuscateReviewField,
          'ui:validations': [validateRoutingNumber],
        },
        accountNumber: {
          ...bankAccountUI.accountNumber,
          'ui:errorMessages': {
            pattern: 'Please enter a valid 5-17 digit bank account number',
          },
          'ui:reviewField': ObfuscateReviewField,
          'ui:validations': [validateBankAccountNumber],
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
              accountNumber: {
                type: 'string',
                pattern: '^[*a-zA-Z0-9]{5,17}$',
              },
              accountType: {
                type: 'string',
                enum: ['Checking', 'Savings'],
              },
              routingNumber: {
                type: 'string',
                pattern: '^[\\d*]{5}\\d{4}$',
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

export default preFilledDirectDeposit33;
