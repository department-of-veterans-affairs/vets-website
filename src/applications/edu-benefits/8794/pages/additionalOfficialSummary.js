import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalOfficialIntro from './AdditionalOfficialIntro';

export const arrayBuilderOptions = {
  arrayPath: 'additional-certifying-official',
  nounSingular: 'additional certifying official',
  nounPlural: 'additional certifying officials',
  required: false,
  // text: {
  //   getItemName: item => item.fullName,
  //   cardDescription: item => {
  //     return item.fullName;
  //   },
  //   summaryTitle: props =>
  //     `Review your ${
  //       props?.formData?.programs.length > 1
  //         ? 'additional certifying officials's
  //         : 'additional certifying official'
  //     }`,
  // },
};

const additionalOfficialSummary = {
  uiSchema: {
    // 'ui:title':'Add additional certifying officials',
    // 'ui:description': additionalOfficialSummaryDescription,
    'view:introduction': {
      // ...titleUI('Add additional certifying officials'),
      'ui:description': AdditionalOfficialIntro,
    },
    'view:additionalOfficialSummary': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title: 'Do you have any additional certifying officials to add?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      hint: () => null,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:introduction': { type: 'object', properties: {} },
      'view:additionalOfficialSummary': arrayBuilderYesNoSchema,
    },
    required: ['view:additionalOfficialSummary'],
  },
};

export { additionalOfficialSummary };
