import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: '85/15 calculation',
  nounPlural: '85/15 calculations',
  required: true,
  text: {
    getItemName: item => item.programName,
  },
};

export const ProgramSummary = {
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
