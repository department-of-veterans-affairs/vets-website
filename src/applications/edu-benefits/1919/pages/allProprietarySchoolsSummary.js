import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export const arrayBuilderOptions = {
  arrayPath: 'all-proprietary-schools',
  nounSingular: 'individual with a potential conflict of interest',
  nounPlural: 'all Proprietary Schools',
  required: true,
};

const schoolsSummary = {
  uiSchema: {
    'view:allProprietarySchools': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title:
        'Do you have another individual with a potential conflict of interest to add?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:allProprietarySchools': arrayBuilderYesNoSchema,
    },
    required: ['view:allProprietarySchools'],
  },
};

export { schoolsSummary as allProprietarySchoolsSummary };
