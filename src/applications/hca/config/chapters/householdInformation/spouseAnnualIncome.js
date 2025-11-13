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
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(
        content['household-info--spouse-income-title'],
        LAST_YEAR,
      ),
    ),
    'view:spouseGrossIncome': {
      'ui:title': content['household-info--spouse-income-gross-title'],
      ...descriptionUI(GrossIncomeDescription),
      spouseGrossIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--spouse-income-gross-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseNetIncome': {
      'ui:title': content['household-info--spouse-income-net-title'],
      'ui:description':
        content['household-info--spouse-income-net-description'],
      spouseNetIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--spouse-income-net-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseOtherIncome': {
      'ui:title': content['household-info--spouse-income-other-title'],
      'ui:description': OtherIncomeDescription,
      spouseOtherIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--spouse-income-other-label'],
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
