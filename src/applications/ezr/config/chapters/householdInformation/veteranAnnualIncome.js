import ezrSchema from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions/IncomeDescriptions';
import { replaceStrValues } from '../../../utils/helpers/general';
import { validateCurrency } from '../../../utils/validation';
import content from '../../../locales/en/content.json';

const { monetaryValue } = ezrSchema.definitions;

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(content['household-veteran-income-title'], lastYear),
    ),
    'view:veteranGrossIncome': {
      'ui:title': content['household-income-gross-title'],
      'ui:description': GrossIncomeDescription,
      veteranGrossIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-gross-label'],
            lastYear,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranNetIncome': {
      'ui:title': content['household-income-net-title'],
      'ui:description': content['household-income-net-description'],
      veteranNetIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-net-label'],
            lastYear,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranOtherIncome': {
      'ui:title': content['household-income-other-title'],
      'ui:description': OtherIncomeDescription,
      veteranOtherIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-other-label'],
            lastYear,
          ),
        ),
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
          veteranGrossIncome: monetaryValue,
        },
      },
      'view:veteranNetIncome': {
        type: 'object',
        required: ['veteranNetIncome'],
        properties: {
          veteranNetIncome: monetaryValue,
        },
      },
      'view:veteranOtherIncome': {
        type: 'object',
        required: ['veteranOtherIncome'],
        properties: {
          veteranOtherIncome: monetaryValue,
        },
      },
    },
  },
};
