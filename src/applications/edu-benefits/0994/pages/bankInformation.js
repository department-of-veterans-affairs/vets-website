import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import bankAccountUI from '../../../../platform/forms/definitions/bankAccount';

import {
  bankInfoTitle,
  bankInfoDescription,
  bankInfoNote,
  bankInfoHelpText,
} from '../content/bankInformation';

const { bankAccount } = fullSchema.properties;

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
  required: ['bankAccount'],
  properties: {
    bankAccount,
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
