import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LAST_YEAR } from '../utils/constants';

/**
 * Declare schema attributes for financial summary page
 * @returns {PageSchema}
 */
export const FinancialSummaryPage = options => ({
  uiSchema: {
    'view:hasFinancialInformationToAdd': arrayBuilderYesNoUI(options, {
      hint: null,
      title: `Do you have any income and deductible to add for ${LAST_YEAR}?`,
    }),
  },

  schema: {
    type: 'object',
    required: ['view:hasFinancialInformationToAdd'],
    properties: {
      'view:hasFinancialInformationToAdd': arrayBuilderYesNoSchema,
    },
  },
});
