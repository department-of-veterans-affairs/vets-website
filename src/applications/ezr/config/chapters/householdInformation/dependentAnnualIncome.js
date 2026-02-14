import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { currencyUI } from 'platform/forms-system/src/js/web-component-patterns';
import { inlineTitleUI } from '../../../components/FormPatterns/TitlePatterns';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../../../components/FormDescriptions/IncomeDescriptions';
import { replaceStrValues } from '../../../utils/helpers/general';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const {
  dependents: { items: dependent },
} = ezrSchema.properties;
const { grossIncome, netIncome, otherIncome } = dependent.properties;

export default {
  uiSchema: {
    'view:grossIncome': {
      ...inlineTitleUI(
        content['household-income-gross-title'],
        replaceStrValues(
          content['household-income-gross-description'],
          LAST_YEAR,
        ),
      ),
      'ui:description': () => GrossIncomeDescription('dependent'),
      grossIncome: currencyUI(
        replaceStrValues(
          content['household-dependent-income-gross-label'],
          LAST_YEAR,
        ),
      ),
    },
    'view:netIncome': {
      ...inlineTitleUI(
        content['household-income-net-title'],
        replaceStrValues(
          content['household-income-net-description'],
          LAST_YEAR,
        ),
      ),
      netIncome: currencyUI(
        replaceStrValues(
          content['household-dependent-income-net-label'],
          LAST_YEAR,
        ),
      ),
    },
    'view:otherIncome': {
      ...inlineTitleUI(
        content['household-income-other-title'],
        replaceStrValues(
          content['household-income-other-description'],
          LAST_YEAR,
        ),
      ),
      'ui:description': () => OtherIncomeDescription('dependent'),
      otherIncome: currencyUI(
        replaceStrValues(
          content['household-dependent-income-other-label'],
          LAST_YEAR,
        ),
      ),
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
