import {
  // addressNoMilitarySchema,
  // addressNoMilitaryUI,
  // currentOrPastDateRangeSchema,
  // currentOrPastDateRangeUI,
  // titleUI,
  // arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  // arrayBuilderItemSubsequentPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
// import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import dependentOptions from '../dependent-options/deceasedDependentOptions';

/** @returns {PageSchema} */
const deceasedDependentSummaryPage = {
  uiSchema: {
    'view:completedDependent': arrayBuilderYesNoUI(
      dependentOptions,
      //   {
      //     title:
      //       'Do you have any employment, including self-employment for the last 5 years to report?',
      //     hint:
      //       'Include self-employment and military duty (including inactive duty for training).',
      //     labels: {
      //       Y: 'Yes, I have employment to report',
      //       N: 'No, I don’t have employment to report',
      //     },
      //   },
      {
        title: 'Do you have another deceased dependent to report?',
        labels: {
          Y: 'Yes, I have another dependent to report',
          N: 'No, I don’t have another dependent to report',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployment': arrayBuilderYesNoSchema,
    },
    required: ['view:completedDependent'],
  },
};

export default deceasedDependentSummaryPage;
