import {
  arrayBuilderItemFirstPageTitleUI,
  currencyUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import content from '../locales/en/content.json';
import { replaceStrValues } from '../utils/helpers/general';
import { LAST_YEAR } from '../utils/constants';
import { inlineTitleUI } from '../components/FormPatterns/TitlePatterns';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
  PreviousNetIncome,
} from '../components/FormDescriptions/IncomeDescriptions';

const {
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
} = ezrSchema.properties;

/**
 * Declare schema attributes for veteran income page
 * @returns {PageSchema}
 */
export const VeteranAnnualIncomePage = () => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: `Your annual income from ${LAST_YEAR}`,
      showEditExplanationText: false,
    }),
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
      'ui:description': () => PreviousNetIncome('veteran'),
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
});
