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
      ...inlineTitleUI(
        content['household-income-gross-title'],
        replaceStrValues(
          content['household-income-gross-description'],
          LAST_YEAR,
        ),
      ),
      'ui:description': () => GrossIncomeDescription('spouse'),
      spouseGrossIncome: currencyUI(
        replaceStrValues(
          content['household-spouse-income-gross-label'],
          LAST_YEAR,
        ),
      ),
    },
    'view:spouseNetIncome': {
      ...inlineTitleUI(
        content['household-income-net-title'],
        replaceStrValues(
          content['household-income-net-description'],
          LAST_YEAR,
        ),
      ),
      spouseNetIncome: currencyUI(
        replaceStrValues(
          content['household-spouse-income-net-label'],
          LAST_YEAR,
        ),
      ),
    },
    'view:spouseOtherIncome': {
      ...inlineTitleUI(
        content['household-income-other-title'],
        replaceStrValues(
          content['household-income-other-description'],
          LAST_YEAR,
        ),
      ),
      'ui:description': () => OtherIncomeDescription('spouse'),
      spouseOtherIncome: currencyUI(
        replaceStrValues(
          content['household-spouse-income-other-label'],
          LAST_YEAR,
        ),
      ),
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
