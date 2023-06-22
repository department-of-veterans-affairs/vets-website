import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { validateCurrency } from '../../../utils/validation';
import {
  GrossIncomeDescription,
  NetIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions';

const {
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
} = fullSchemaHca.properties;

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    'ui:title': `Your annual income from ${lastYear}`,
    'view:veteranGrossIncome': {
      'ui:title': 'Gross income from work',
      'ui:description': GrossIncomeDescription,
      veteranGrossIncome: {
        ...currencyUI(`Enter your gross annual income from ${lastYear}`),
        'ui:validations': [validateCurrency],
        'ui:required': () => true,
      },
    },
    'view:veteranNetIncome': {
      'ui:title': 'Net annual income from your farm, property, or business',
      'ui:description': NetIncomeDescription,
      veteranNetIncome: {
        ...currencyUI(
          `Enter your net annual income from a farm, property, or business from ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
        'ui:required': () => true,
      },
    },
    'view:veteranOtherIncome': {
      'ui:title': 'Other income',
      'ui:description': OtherIncomeDescription,
      veteranOtherIncome: {
        ...currencyUI(`Enter your other income from ${lastYear}`),
        'ui:validations': [validateCurrency],
        'ui:required': () => true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:veteranGrossIncome': {
        type: 'object',
        required: ['veteranGrossIncome'],
        properties: {
          veteranGrossIncome,
        },
      },
      'view:veteranNetIncome': {
        type: 'object',
        required: ['veteranNetIncome'],
        properties: {
          veteranNetIncome,
        },
      },
      'view:veteranOtherIncome': {
        type: 'object',
        required: ['veteranOtherIncome'],
        properties: {
          veteranOtherIncome,
        },
      },
    },
  },
};
