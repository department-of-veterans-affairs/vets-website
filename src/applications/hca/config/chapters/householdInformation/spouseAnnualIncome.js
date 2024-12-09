import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { validateCurrency } from '../../../utils/validation';
import { LAST_YEAR } from '../../../utils/constants';
import { FULL_SCHEMA } from '../../../utils/imports';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions';

const {
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': `Spouse\u2019s annual income from ${LAST_YEAR}`,
    'view:spouseGrossIncome': {
      'ui:title': 'Gross income from work',
      'ui:description': GrossIncomeDescription,
      spouseGrossIncome: {
        ...currencyUI(
          `Enter your spouse\u2019s gross annual income from ${LAST_YEAR}`,
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
          `Enter your spouse\u2019s net annual income from a farm, ranch, property or business from ${LAST_YEAR}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseOtherIncome': {
      'ui:title': 'Other income',
      'ui:description': OtherIncomeDescription,
      spouseOtherIncome: {
        ...currencyUI(
          `Enter your spouse\u2019s other annual income from ${LAST_YEAR}`,
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
