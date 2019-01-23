import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import bankAccountUI from '../../../../platform/forms/definitions/bankAccount';

import {
  bankInfoTitle,
  bankInfoDescription,
  bankInfoNote,
  bankInfoHelpText,
} from '../content/bankInformation';

const {
  accountType,
  routingNumber,
  accountNumber,
} = fullSchema.definitions.bankAccount.properties;

export const uiSchema = {
  'ui:title': bankInfoTitle,
  'ui:description': bankInfoDescription,
  bankAccount: bankAccountUI,
  'view:bankInfoNote': {
    'ui:title': ' ',
    'ui:description': bankInfoNote,
  },
  'view:bankInfoHelpText': {
    'ui:title': ' ',
    'ui:description': bankInfoHelpText,
  },
};

export const schema = {
  type: 'object',
  properties: {
    bankAccount: {
      type: 'object',
      required: ['accountType', 'routingNumber', 'accountNumber'],
      properties: {
        accountType,
        routingNumber,
        accountNumber,
      },
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
};
