import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { validateCurrency } from '../../../utils/validation';
import {
  GrossIncomeDescription,
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
    'ui:title': `Spouse\u2019s annual income from ${lastYear}`,
    'view:spouseGrossIncome': {
      'ui:title': 'Gross income from work',
      'ui:description': GrossIncomeDescription,
      spouseGrossIncome: {
        ...currencyUI(
          `Enter your spouse\u2019s gross annual income from ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseNetIncome': {
      'ui:title': 'Net income from a farm, property, or business',
      'ui:description':
        'Net income is income after any taxes and other deductions are subtracted.',
      spouseNetIncome: {
        ...currencyUI(
          `Enter your spouse\u2019s net annual income from a farm, ranch, property or business from ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseOtherIncome': {
      'ui:title': 'Other income',
      'ui:description': OtherIncomeDescription,
      spouseOtherIncome: {
        ...currencyUI(
          `Enter your spouse\u2019s other annual income from ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
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
