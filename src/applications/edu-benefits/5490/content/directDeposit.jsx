import React from 'react';
import { isValidRoutingNumber } from 'platform/forms/validations';
import merge from 'lodash/merge';

export const gaBankInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-5490--form-help-text-clicked',
    'help-text-label': 'What if I don’t have a bank account?',
  });
};

const bankInfoHelpText = (
  <va-additional-info
    trigger="What if I don’t have a bank account?"
    onClick={gaBankInfoHelpText}
  >
    <span>
      <p>
        The{' '}
        <a href="https://veteransbenefitsbanking.org/">
          Veterans Benefits Banking Program (VBBP)
        </a>{' '}
        provides a list of Veteran-friendly banks and credit unions. They’ll
        work with you to set up an account, or help you qualify for an account,
        so you can use direct deposit. To get started, call one of the
        participating banks or credit unions listed on the VBBP website. Be sure
        to mention the Veterans Benefits Banking Program.
      </p>
      <p>
        Note: Federal regulation, found in 31 C.F.R. § 208.3 provides that,
        subject to section 208.4, “all Federal payments made by an agency shall
        be made by electronic funds transfer” (EFT).
      </p>
    </span>
  </va-additional-info>
);

const directDepositDescription = (
  <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
    <p>
      Direct deposit information is not mandatory at this time. However,
      benefits cannot be awarded without this information per U.S. Treasury
      regulation 31 C.F.R. § 208.3.
    </p>
    <img
      src="/img/direct-deposit-check-guide.svg"
      alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
    />
  </div>
);

export function validateRoutingNumber(
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
      'view:bankInfoHelpText': {
        type: 'object',
        properties: {},
      },
    },
  };

  return {
    title: 'Direct deposit',
    path: 'personal-information/direct-deposit',
    initialData: {},
    uiSchema: {
      'ui:title': 'Direct deposit',
      'ui:description': directDepositDescription,
      bankAccount: merge(
        {},
        {
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
          },
          routingNumber: {
            'ui:title': "Bank's 9-digit routing number",
            'ui:validations': [validateRoutingNumber],
            'ui:errorMessages': {
              pattern: 'Please enter a valid 9 digit routing number',
            },
          },
          'view:bankInfoHelpText': {
            'ui:description': bankInfoHelpText,
            'ui:options': {
              hideOnReview: true,
            },
          },
        },
      ),
    },
    schema: {
      type: 'object',
      properties: {
        bankAccount: bankAccountProperties,
      },
    },
  };
}
