import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import Introduction from '../components/ProgramIntro';

export const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: 'program',
  nounPlural: 'programs',
  required: false,
  text: {
    getItemName: item => item.programName,
  },
};

const ProgramSummary = {
  uiSchema: {
    'view:introduction': {
      'ui:description': Introduction,
    },
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
      'view:introduction': {
        type: 'object',
        properties: {},
      },
      'view:programsSummary': arrayBuilderYesNoSchema,
    },
    required: ['view:programsSummary'],
  },
};

export { ProgramSummary };
