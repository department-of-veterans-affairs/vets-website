import React from 'react';
import { isValidRoutingNumber } from '../validations';
import environment from 'platform/utilities/environment';

function validateRoutingNumber(
  errors,
  routingNumber,
  formData,
  schema,
  errorMessages,
) {
  if (!isValidRoutingNumber(routingNumber)) {
    errors.addError(errorMessages.pattern);
  }
}

const isProduction = environment.isProduction();
const directDepositDescription = () => {
  return environment.isProduction() ? (
    ''
  ) : (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
      <p>
        We make payments only through direct deposit, also called electronic
        funds transfer (EFT). Please provide your direct deposit information
        below. We’ll send your housing payment to this account.
      </p>
      <img
        src="/img/direct-deposit-check-guide.svg"
        alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
      />
    </div>
  );
};

const legacySchema = {
  'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
  accountType: {
    'ui:title': 'Account type',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        checking: 'Checking',
        savings: 'Savings',
      },
    },
  },
  accountNumber: {
    'ui:title': 'Bank account number',
    'ui:errorMessages': {
      required: 'Please enter a bank account number',
    },
  },
  routingNumber: {
    'ui:title': 'Bank routing number',
    'ui:validations': [validateRoutingNumber],
    'ui:errorMessages': {
      pattern: 'Please enter a valid nine digit routing number',
      required: 'Please enter a routing number',
    },
  },
};

const newUiSchema = {
  'ui:order': ['accountType', 'routingNumber', 'accountNumber'],
  'ui:description': directDepositDescription(),
  accountType: {
    'ui:title': 'Account type',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        checking: 'Checking',
        savings: 'Savings',
      },
    },
  },
  accountNumber: {
    'ui:title': 'Bank account number',
    'ui:errorMessages': {
      pattern: 'Please enter a valid account number',
      required: 'Please enter a bank account number',
    },
  },
  routingNumber: {
    'ui:title': 'Bank’s 9 digit routing number',
    'ui:validations': [validateRoutingNumber],
    'ui:required': true,
    'ui:errorMessages': {
      pattern: 'Please enter a valid 9 digit routing number',
      required: 'Please enter a routing number',
    },
  },
};

const uiSchema = legacySchema;

export default uiSchema;
