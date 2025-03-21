import { arrayBuilderItemFirstPageTitleUI } from 'platform/forms-system/src/js/web-component-patterns';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import content from '../locales/en/content.json';
import { replaceStrValues } from '../utils/helpers/general';
import { LAST_YEAR } from '../utils/constants';
import { inlineTitleUI } from '../components/FormPatterns/TitlePatterns';
import {
  GrossIncomeDescription,
  OtherIncomeDescription,
  PreviousNetIncome,
} from '../components/FormDescriptions/IncomeDescriptions';
import { validateCurrency } from '../utils/validation';

const {
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
} = ezrSchema.properties;

/**
 * Declare schema attributes for spouse income page
 * @returns {PageSchema}
 */
export const SpouseAnnualIncomePage = () => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: `Spouse's annual income from ${LAST_YEAR}`,
    }),
    'view:spouseGrossIncome': {
      ...inlineTitleUI(
        content['household-income-gross-title'],
        content['household-income-gross-description'],
      ),
      'ui:description': GrossIncomeDescription('spouse'),
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
      ...inlineTitleUI(
        content['household-income-net-title'],
        content['household-income-net-description'],
      ),
      'ui:description': PreviousNetIncome('spouse'),
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
      ...inlineTitleUI(
        content['household-income-other-title'],
        content['household-income-other-description'],
      ),
      'ui:description': OtherIncomeDescription('spouse'),
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
});
