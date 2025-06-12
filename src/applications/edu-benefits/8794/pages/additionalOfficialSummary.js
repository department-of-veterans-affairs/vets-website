import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalOfficialIntro from './AdditionalOfficialIntro';

export const arrayBuilderOptions = {
  arrayPath: 'additional-certifying-official',
  nounSingular: 'certifying official',
  nounPlural: 'certifying officials',
  required: false,
};

const additionalOfficialSummary = {
  uiSchema: {
    'view:introduction': {
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
