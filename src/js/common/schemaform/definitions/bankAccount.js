import _ from 'lodash/fp';
import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';
import { validateRoutingNumber } from '../validation';

export const schema = _.set(
  'properties.accountType.enumNames',
  [
    'Checking',
    'Savings'
  ],
  fullSchema1995.definitions.bankAccount
);

export const uiSchema = {
  'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
  accountType: {
    'ui:title': 'Account type',
    'ui:widget': 'radio'
  },
  accountNumber: {
    'ui:title': 'Account number'
  },
  routingNumber: {
    'ui:title': 'Routing number',
    'ui:validations': [
      validateRoutingNumber
    ],
    'ui:errorMessages': {
      pattern: 'Please enter a valid nine digit routing number'
    }
  }
};
