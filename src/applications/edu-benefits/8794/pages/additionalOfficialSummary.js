import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const arrayBuilderOptions = {
  arrayPath: 'additional-certifying-official',
  nounSingular: 'certifying official',
  nounPlural: 'certifying officials',
  required: false,
};

const additionalOfficialSummary = {
  uiSchema: {
    'view:additionalOfficialSummary': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title: 'Do you have any additional certifying officials to add?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      hint: () => null,
      errorMessages: {
        required: 'Please provide a response',
      },
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
