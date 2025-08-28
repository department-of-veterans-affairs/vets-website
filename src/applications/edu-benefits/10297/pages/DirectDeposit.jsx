import React from 'react';
import {
  bankAccountUI,
  bankAccountSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isValidRoutingNumber } from 'platform/forms/validations';
import { CheckGuideDetails } from '../components/CheckGuideDetails';
import BankInfoHelpText from '../components/BankInfoHelpText';
import MaskedBankAccountInfo from '../components/MaskedBankAccountInfo';

const validateRoutingNumber = (errors, routingNumber) => {
  if (!routingNumber) return;
  const cleanValue = routingNumber.toString().replace(/[^\d]/g, '');
  if (!isValidRoutingNumber(cleanValue)) {
    errors.addError('Please enter a valid 9 digit routing number');
  }
};

const EligibilityRegulationNote = () => (
  <p>
    Direct deposit information is not required to determine eligibility.
    However, benefits cannot be paid without this information per U.S. Treasury
    regulation 31 C.F.R. § 208.3.
  </p>
);

const NullField = () => '';

export default function createDirectDepositPage() {
  const baseSchema = bankAccountSchema({ omitBankName: true });

  const schema = {
    type: 'object',
    properties: {
      bankAccount: {
        type: 'object',
        required: baseSchema.required,
        properties: {
          ...baseSchema.properties,

          'view:checkGuideDetails': {
            type: 'object',
            properties: {
              _keep: { type: 'string', properties: {} },
            },
          },

          'view:bankInfoHelpText': {
            type: 'object',
            properties: {
              _keep: { type: 'string', properties: {} },
            },
          },
        },
      },
    },
  };

  const baseUI = bankAccountUI({ omitBankName: true });
  const baseUIWithoutDesc = { ...baseUI };
  delete baseUIWithoutDesc['ui:description'];

  const uiSchema = {
    ...titleUI('Direct deposit'),
    'ui:description': <EligibilityRegulationNote />,

    bankAccount: {
      ...baseUIWithoutDesc,

      'ui:order': [
        'accountType',
        'view:checkGuideDetails',
        'routingNumber',
        'accountNumber',
        'view:bankInfoHelpText',
      ],

      accountType: {
        ...baseUIWithoutDesc.accountType,
        'ui:errorMessages': { required: 'Select an account type' },
      },

      'view:checkGuideDetails': {
        'ui:description': <CheckGuideDetails />,
        _keep: {
          'ui:field': NullField,
          'ui:options': { hideIf: () => true },
        },
      },

      routingNumber: {
        ...baseUIWithoutDesc.routingNumber,
        'ui:title': 'Bank’s 9-digit routing number',
        'ui:validations': [validateRoutingNumber],
        'ui:webComponentField': MaskedBankAccountInfo,
        'ui:errorMessages': {
          required: 'Enter a 9-digit routing number',
          pattern: 'Please enter a valid 9 digit routing number',
        },
      },

      accountNumber: {
        ...baseUIWithoutDesc.accountNumber,
        'ui:webComponentField': MaskedBankAccountInfo,
        'ui:errorMessages': { required: 'Enter your account number' },
      },

      'view:bankInfoHelpText': {
        'ui:description': <BankInfoHelpText />,
        _keep: {
          'ui:field': NullField,
          'ui:options': { hideIf: () => true },
        },
      },
    },
  };

  return {
    title: 'Direct deposit',
    path: 'direct-deposit',
    uiSchema,
    schema,
  };
}
