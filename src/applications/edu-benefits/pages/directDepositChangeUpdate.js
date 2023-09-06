import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';

import bankAccountUI from 'platform/forms/definitions/bankAccount';

import { bankAccountChangeLabelsUpdate } from '../utils/labels';

function isStartUpdate(form) {
  return get('bankAccountChangeUpdate', form) === 'startUpdate';
}

export default function createDirectDepositChangePage(schema) {
  const { bankAccountChangeUpdate, bankAccount } = schema.definitions;
  return {
    title: 'Direct deposit',
    path: 'personal-information/direct-deposit',
    initialData: {},
    uiSchema: {
      'ui:title': 'Direct deposit',
      bankAccountChangeUpdate: {
        'ui:title': 'Benefit payment method:',
        'ui:widget': 'radio',
        'ui:options': {
          labels: bankAccountChangeLabelsUpdate,
        },
      },
      bankAccount: merge({}, bankAccountUI, {
        'ui:options': {
          hideIf: formData => !isStartUpdate(formData),
          expandUnder: 'bankAccountChangeUpdate',
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
      }),
    },
    schema: {
      type: 'object',
      properties: {
        bankAccountChangeUpdate,
        bankAccount,
        'view:stopWarning': {
          type: 'object',
          properties: {},
        },
      },
    },
  };
}
