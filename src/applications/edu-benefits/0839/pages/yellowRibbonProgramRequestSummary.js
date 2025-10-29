import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export const arrayBuilderOptions = {
  arrayPath: 'yellowRibbonProgramRequest',
  nounSingular: 'contribution',
  nounPlural: 'contributions',
  required: false,
  text: {
    getItemName: item => {
      // Use degree level as the primary identifier, fallback to college/school name
      if (item.degreeLevel) {
        return item.degreeLevel;
      }
      if (item.collegeOrProfessionalSchool) {
        return item.collegeOrProfessionalSchool;
      }
      return 'Contribution';
    },
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
