import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions/IncomeDescriptions';
import { replaceStrValues } from '../../../utils/helpers/general';
import { validateCurrency } from '../../../utils/validation';
import content from '../../../locales/en/content.json';

const {
  dependents: { items: dependent },
} = ezrSchema.properties;
const { grossIncome, netIncome, otherIncome } = dependent.properties;

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    'view:grossIncome': {
      'ui:title': content['household-income-gross-title'],
      'ui:description': GrossIncomeDescription,
      grossIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-dependent-income-gross-label'],
            lastYear,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:netIncome': {
      'ui:title': content['household-income-net-title'],
      'ui:description': content['household-income-net-description'],
      netIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-dependent-income-net-label'],
            lastYear,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:otherIncome': {
      'ui:title': content['household-income-other-title'],
      'ui:description': OtherIncomeDescription,
      otherIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-dependent-income-other-label'],
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
      'view:grossIncome': {
        type: 'object',
        required: ['grossIncome'],
        properties: { grossIncome },
      },
      'view:netIncome': {
        type: 'object',
        required: ['netIncome'],
        properties: { netIncome },
      },
      'view:otherIncome': {
        type: 'object',
        required: ['otherIncome'],
        properties: { otherIncome },
      },
    },
  },
};
