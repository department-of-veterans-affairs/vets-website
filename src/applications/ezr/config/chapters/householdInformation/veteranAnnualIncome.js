import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  titleUI,
  currencyUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { inlineTitleUI } from '../../../components/FormPatterns/TitlePatterns';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions/IncomeDescriptions';
import { replaceStrValues } from '../../../utils/helpers/general';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const { veteranGrossIncome, veteranNetIncome, veteranOtherIncome } =
  ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(content['household-veteran-income-title'], LAST_YEAR),
    ),
    'view:veteranGrossIncome': {
      ...inlineTitleUI(
        content['household-income-gross-title'],
        replaceStrValues(
          content['household-income-gross-description'],
          LAST_YEAR,
        ),
      ),
      'ui:description': () => GrossIncomeDescription('veteran'),
      veteranGrossIncome: currencyUI(
        replaceStrValues(
          content['household-veteran-income-gross-label'],
          LAST_YEAR,
        ),
      ),
    },
    'view:veteranNetIncome': {
      ...inlineTitleUI(
        content['household-income-net-title'],
        replaceStrValues(
          content['household-income-net-description'],
          LAST_YEAR,
        ),
      ),
      veteranNetIncome: currencyUI(
        replaceStrValues(
          content['household-veteran-income-net-label'],
          LAST_YEAR,
        ),
      ),
    },
    'view:veteranOtherIncome': {
      ...inlineTitleUI(
        content['household-income-other-title'],
        replaceStrValues(
          content['household-income-other-description'],
          LAST_YEAR,
        ),
      ),
      'ui:description': () => OtherIncomeDescription('veteran'),
      veteranOtherIncome: currencyUI(
        replaceStrValues(
          content['household-veteran-income-other-label'],
          LAST_YEAR,
        ),
      ),
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
