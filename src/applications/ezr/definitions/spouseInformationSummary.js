import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/**
 * Spouse information summary page. Review cards are populated on this page
 * if spouse information is present.
 *
 * @returns {PageSchema}
 */
const spouseInformationSummaryPage = (options = {}) => ({
  uiSchema: {
    'view:hasSpouseInformationToAdd': arrayBuilderYesNoUI(options, {
      hint: null,
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
