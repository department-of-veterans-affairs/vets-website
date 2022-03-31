// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import bankAccountUI from 'platform/forms-system/src/js/definitions/bankAccount';

import { hasDirectDeposit, directDepositWarning } from '../helpers';

const { bankAccount } = commonDefinitions;

const directDeposit = {
  uiSchema: {
    'ui:title': 'Direct deposit',
    viewNoDirectDeposit: {
      'ui:title': 'I don’t want to use direct deposit',
    },
    bankAccount: {
      ...bankAccountUI,
      'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
      'ui:options': {
        hideIf: formData => !hasDirectDeposit(formData),
      },
      accountType: {
        'ui:required': hasDirectDeposit,
      },
      accountNumber: {
        'ui:required': hasDirectDeposit,
      },
      routingNumber: {
        'ui:required': hasDirectDeposit,
      },
    },
    viewStopWarning: {
      'ui:description': directDepositWarning,
      'ui:options': {
        hideIf: hasDirectDeposit,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      viewNoDirectDeposit: {
        type: 'boolean',
      },
      bankAccount,
      viewStopWarning: {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default directDeposit;
