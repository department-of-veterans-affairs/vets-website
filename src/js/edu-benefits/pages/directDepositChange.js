import _ from 'lodash/fp';

import { uiSchema as bankAccountUI } from '../../common/schemaform/definitions/bankAccount';

import {
  bankAccountChangeLabels,
  directDepositWarning
} from '../utils/helpers';

export default function createDirectDepositChangePage(schema) {
  const { bankAccountChange, bankAccount } = schema.definitions;
  return {
    title: 'Direct deposit',
    path: 'personal-information/direct-deposit',
    initialData: {},
    uiSchema: {
      bankAccountChange: {
        'ui:title': 'Benefit payment method:',
        'ui:widget': 'radio',
        'ui:options': {
          labels: bankAccountChangeLabels
        }
      },
      bankAccount: _.merge(bankAccountUI, {
        'ui:options': {
          hideIf: (formData) => formData.bankAccountChange !== 'startUpdate'
        }
      }),
      'view:stopWarning': {
        'ui:description': directDepositWarning,
        'ui:options': {
          hideIf: (formData) => formData.bankAccountChange !== 'stop'
        }
      }
    },
    schema: {
      type: 'object',
      properties: {
        bankAccountChange,
        bankAccount,
        'view:stopWarning': {
          type: 'object',
          properties: {}
        }
      }
    }
  };
}
