import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { validateCurrency } from '../../../utils/validation';
import {
  GrossIncomeDescription,
  NetIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions';

const {
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
} = fullSchemaHca.properties;

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    'ui:title': `Your spouse\u2019s annual income from ${lastYear}`,
    'view:spouseGrossIncome': {
      'ui:title': 'Your spouse\u2019s gross income from work',
      'ui:description': GrossIncomeDescription,
      spouseGrossIncome: {
        ...currencyUI(`Enter your spouse\u2019s gross income from ${lastYear}`),
        'ui:validations': [validateCurrency],
        'ui:required': () => true,
      },
    },
    'view:spouseNetIncome': {
      'ui:title':
        'Your spouse\u2019s net annual income from your farm, property, or business',
      'ui:description': NetIncomeDescription,
      spouseNetIncome: {
        ...currencyUI(
          `Enter your spouse\u2019s net income from a farm, ranch, property or business from ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
        'ui:required': () => true,
      },
    },
    'view:spouseOtherIncome': {
      'ui:title': 'Your spouse\u2019s other income',
      'ui:description': OtherIncomeDescription,
      spouseOtherIncome: {
        ...currencyUI(`Enter your spouse\u2019s other income from ${lastYear}`),
        'ui:validations': [validateCurrency],
        'ui:required': () => true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:spouseGrossIncome': {
        type: 'object',
        required: ['spouseGrossIncome'],
        properties: {
          spouseGrossIncome,
        },
      },
      'view:spouseNetIncome': {
        type: 'object',
        required: ['spouseNetIncome'],
        properties: {
          spouseNetIncome,
        },
      },
      'view:spouseOtherIncome': {
        type: 'object',
        required: ['spouseOtherIncome'],
        properties: {
          spouseOtherIncome,
        },
      },
    },
  },
};
