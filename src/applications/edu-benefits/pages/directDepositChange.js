import get from 'platform/utilities/data/get';
import merge from 'lodash/merge';

import bankAccountUI from '../../../platform/forms/definitions/bankAccount';

import { bankAccountChangeLabels, directDepositWarning } from '../utils/labels';

function isStartUpdate(form) {
  return get('bankAccountChange', form) === 'startUpdate';
}

export default function createDirectDepositChangePage(schema) {
  const { bankAccountChange, bankAccount } = schema.definitions;
  return {
    title: 'Direct deposit',
    path: 'personal-information/direct-deposit',
    initialData: {},
    uiSchema: {
      'ui:title': 'Direct deposit',
      bankAccountChange: {
        'ui:title': 'Benefit payment method:',
        'ui:widget': 'radio',
        'ui:options': {
          labels: bankAccountChangeLabels,
        },
      },
      bankAccount: merge(
        {
          'ui:options': {
            hideIf: formData => !isStartUpdate(formData),
          },
          accountType: {
            'ui:required': isStartUpdate,
          },
          accountNumber: {
            'ui:required': isStartUpdate,
          },
          routingNumber: {
            'ui:required': isStartUpdate,
          },
        },
        bankAccountUI,
      ),
      'view:stopWarning': {
        'ui:description': directDepositWarning,
        'ui:options': {
          hideIf: formData => formData.bankAccountChange !== 'stop',
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        bankAccountChange,
        bankAccount,
        'view:stopWarning': {
          type: 'object',
          properties: {},
        },
      },
    },
  };
}
