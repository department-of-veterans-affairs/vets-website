import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions/IncomeDescriptions';
import { replaceStrValues } from '../../../utils/helpers/general';
import { validateCurrency } from '../../../utils/validation';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const {
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
} = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(content['household-spouse-income-title'], LAST_YEAR),
    ),
    'view:spouseGrossIncome': {
      'ui:title': content['household-income-gross-title'],
      'ui:description': GrossIncomeDescription,
      spouseGrossIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-spouse-income-gross-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseNetIncome': {
      'ui:title': content['household-income-net-title'],
      'ui:description': content['household-income-net-description'],
      spouseNetIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-spouse-income-net-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseOtherIncome': {
      'ui:title': content['household-income-other-title'],
      'ui:description': OtherIncomeDescription,
      spouseOtherIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-spouse-income-other-label'],
            LAST_YEAR,
          ),
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
        properties: { spouseGrossIncome },
      },
      'view:spouseNetIncome': {
        type: 'object',
        required: ['spouseNetIncome'],
        properties: { spouseNetIncome },
      },
      'view:spouseOtherIncome': {
        type: 'object',
        required: ['spouseOtherIncome'],
        properties: { spouseOtherIncome },
      },
    },
  },
};
