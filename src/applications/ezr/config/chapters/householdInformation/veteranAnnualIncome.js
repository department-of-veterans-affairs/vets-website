import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { inlineTitleUI } from '../../../components/FormPatterns/TitlePatterns';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions/IncomeDescriptions';
import { replaceStrValues } from '../../../utils/helpers/general';
import { validateCurrency } from '../../../utils/validation';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const {
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
} = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(content['household-veteran-income-title'], LAST_YEAR),
    ),
    'view:veteranGrossIncome': {
      ...inlineTitleUI(
        content['household-income-gross-title'],
        content['household-income-gross-description'],
      ),
      'ui:description': GrossIncomeDescription,
      veteranGrossIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-gross-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranNetIncome': {
      ...inlineTitleUI(
        content['household-income-net-title'],
        content['household-income-net-description'],
      ),
      veteranNetIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-net-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranOtherIncome': {
      ...inlineTitleUI(
        content['household-income-other-title'],
        content['household-income-other-description'],
      ),
      'ui:description': OtherIncomeDescription,
      veteranOtherIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-other-label'],
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
        properties: { veteranGrossIncome },
      },
      'view:veteranNetIncome': {
        type: 'object',
        required: ['veteranNetIncome'],
        properties: { veteranNetIncome },
      },
      'view:veteranOtherIncome': {
        type: 'object',
        required: ['veteranOtherIncome'],
        properties: { veteranOtherIncome },
      },
    },
  },
};
