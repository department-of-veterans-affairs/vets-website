import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: 'program',
  nounPlural: 'programs',
  required: true,
  text: {
    getItemName: item => item.programName,
  },
};

const ProgramSummary = {
  uiSchema: {
    'view:programsSummary': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title: 'Do you have another program to add?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:programsSummary': arrayBuilderYesNoSchema,
    },
    required: ['view:programsSummary'],
  },
};

export { ProgramSummary };
