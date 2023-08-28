import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import bankAccountUI from 'platform/forms/definitions/bankAccount';

import {
  bankAccountChangeLabelsUpdate,
  directDepositWarning,
} from '../utils/labels';

function isStartUpdateUpdate(form) {
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
          hideIf: formData => !isStartUpdateUpdate(formData),
          expandUnder: 'bankAccountChangeUpdate',
        },
        accountType: {
          'ui:required': isStartUpdateUpdate,
        },
        accountNumber: {
          'ui:required': isStartUpdateUpdate,
        },
        routingNumber: {
          'ui:required': isStartUpdateUpdate,
        },
      }),
      'view:stopWarning': {
        'ui:description': directDepositWarning,
        'ui:options': {
          hideIf: formData => formData.bankAccountChangeUpdate !== 'stop',
          expandUnder: 'bankAccountChangeUpdate',
        },
      },
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
