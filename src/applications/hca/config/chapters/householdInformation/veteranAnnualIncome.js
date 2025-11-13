import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { validateCurrency } from '../../../utils/validation';
import { LAST_YEAR, replaceStrValues } from '../../../utils/helpers';
import { FULL_SCHEMA } from '../../../utils/imports';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const {
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(content['household-info--vet-income-title'], LAST_YEAR),
    ),
    'view:veteranGrossIncome': {
      'ui:title': content['household-info--vet-income-gross-title'],
      ...descriptionUI(GrossIncomeDescription),
      veteranGrossIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--vet-income-gross-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranNetIncome': {
      'ui:title': content['household-info--vet-income-net-title'],
      ...descriptionUI(content['household-info--vet-income-net-description']),
      veteranNetIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--vet-income-net-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranOtherIncome': {
      'ui:title': content['household-info--vet-income-other-title'],
      ...descriptionUI(OtherIncomeDescription),
      veteranOtherIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--vet-income-other-label'],
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
