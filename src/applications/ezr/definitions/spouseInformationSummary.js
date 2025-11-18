import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';

/**
 * Spouse information summary page. Review cards are populated on this page
 * if spouse information is present.
 *
 * @returns {PageSchema}
 */
const spouseInformationSummaryPage = (options = {}) => ({
  uiSchema: {
    'view:hasSpouseInformationToAdd': arrayBuilderYesNoUI(options, {
      hint: content['household-spouse-information-summary-hint'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasSpouseInformationToAdd': arrayBuilderYesNoSchema,
    },
    required: ['view:hasSpouseInformationToAdd'],
  },
});

export default spouseInformationSummaryPage;
