import React from 'react';
import { isValidRoutingNumber } from 'platform/forms/validations';

const gaBankInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-0994--form-help-text-clicked',
    'help-text-label': 'What if I don’t have a bank account?',
  });
};

const bankInfoNote = (
  <div>
    <p>
      <strong>Note: </strong>
      Any updates you make here to your bank account information will apply to
      your other Veteran benefits, including compensation, pension, and
      education. Updates here won’t change accounts on file for your VA health
      benefits.
    </p>
  </div>
);

const bankInfoHelpText = (
  <va-additional-info
    trigger="What if I don’t have a bank account?"
    onClick={gaBankInfoHelpText}
  >
    <span>
      <p>
        The{' '}
        <a href="https://www.usdirectexpress.com/">
          Veterans Benefits Banking Program (VBBP)
        </a>{' '}
        provides a list of Veteran-friendly banks and credit unions. They’ll
        work with you to set up an account, or help you qualify for an account,
        so you can use direct deposit. To get started, call one of the
        participating banks or credit unions listed on the VBBP website. Be sure
        to mention the Veterans Benefits Banking Program.
      </p>
      <p>
        Note: The Department of the Treasury requires us to make electronic
        payments. If you don’t want to use direct deposit, you’ll need to call
        the Department of the Treasury at{' '}
        <a className="help-phone-number-link" href="tel:1-888-224-2950">
          888-224-2950
        </a>{' '}
        . Ask to talk with a representative who handles waiver requests. They
        can answer any questions or concerns you may have.
      </p>
    </span>
  </va-additional-info>
);

const directDepositDescription = () => {
  return (
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

const uiSchema = {
  'ui:order': [
    'accountType',
    'accountNumber',
    'routingNumber',
    'view:bankInfoNote',
    'view:bankInfoHelpText',
  ],
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
  'view:bankInfoNote': {
    'ui:description': bankInfoNote,
  },
  'view:bankInfoHelpText': {
    'ui:description': bankInfoHelpText,
  },
};

export default function createDirectDepositPage() {
  const bankAccountProperties = {
    type: 'object',
    properties: {
      accountType: {
        type: 'string',
        enum: ['checking', 'savings'],
      },
      routingNumber: {
        type: 'string',
        pattern: '^\\d{9}$',
      },
      accountNumber: {
        type: 'string',
      },
      'view:bankInfoNote': {
        type: 'object',
        properties: {},
      },
      'view:bankInfoHelpText': {
        type: 'object',
        properties: {},
      },
    },
    required: [],
  };

  return {
    title: 'Direct deposit',
    path: 'personal-information/direct-deposit',
    initialData: {},
    uiSchema: {
      'ui:title': 'Direct deposit',
      'ui:description': directDepositDescription(),
      bankAccount: uiSchema,
    },
    schema: {
      type: 'object',
      properties: {
        bankAccount: bankAccountProperties,
      },
    },
  };
}
