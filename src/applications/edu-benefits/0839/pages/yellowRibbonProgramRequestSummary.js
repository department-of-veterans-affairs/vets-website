import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export const arrayBuilderOptions = {
  arrayPath: 'yellowRibbonProgramRequest.contributions',
  nounSingular: 'contribution',
  nounPlural: 'contributions',
  required: false,
  text: {
    getItemName: item => item.contributionName || 'Contribution',
  },
};

const yellowRibbonProgramRequestSummary = {
  uiSchema: {
    'view:contributionsSummary': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title: 'Do you have another Yellow Ribbon Program contribution to add?',
      labels: {
        Y: 'Yes, I want to add another contribution ',
        N: "No, I don't have another contribution to add",
      },
      hint: '',
      errorMessages: {
        required: 'Select yes if you have another contribution to add',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:contributionsSummary': arrayBuilderYesNoSchema,
    },
    required: ['view:contributionsSummary'],
  },
};

export const { uiSchema } = yellowRibbonProgramRequestSummary;
export const { schema } = yellowRibbonProgramRequestSummary;
