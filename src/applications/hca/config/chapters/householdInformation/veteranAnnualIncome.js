import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { validateCurrency } from '../../../utils/validation';
import { LAST_YEAR } from '../../../utils/constants';
import { FULL_SCHEMA } from '../../../utils/imports';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions';

const {
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': `Your annual income from ${LAST_YEAR}`,
    'view:veteranGrossIncome': {
      'ui:title': 'Gross income from work',
      'ui:description': GrossIncomeDescription,
      veteranGrossIncome: {
        ...currencyUI(`Enter your gross annual income from ${LAST_YEAR}`),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranNetIncome': {
      'ui:title': 'Net income from a farm, property, or business',
      'ui:description':
        'Net income is income after any taxes and other deductions are subtracted.',
      veteranNetIncome: {
        ...currencyUI(
          `Enter your net annual income from a farm, property, or business from ${LAST_YEAR}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranOtherIncome': {
      'ui:title': 'Other income',
      'ui:description': OtherIncomeDescription,
      veteranOtherIncome: {
        ...currencyUI(`Enter your other annual income from ${LAST_YEAR}`),
        'ui:validations': [validateCurrency],
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
