import _ from 'lodash/fp';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { validateRoutingNumber } from '../validation';

export const schema = _.set(
  'properties.accountType.enumNames',
  [
    'Checking',
    'Savings'
  ],
  commonDefinitions.bankAccount
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
