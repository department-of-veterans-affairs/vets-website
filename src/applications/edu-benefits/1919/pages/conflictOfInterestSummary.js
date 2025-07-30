import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import ConflictOfInterestIntro from './conflictOfInterestIntro';

const arrayBuilderOptions = {
  arrayPath: 'conflictOfInterestArrayOptions',
  nounSingular: 'individual with a potential conflict of interest',
  nounPlural: 'individuals with a potential conflict of interest',
  required: false,
};

const schoolsSummary = {
  uiSchema: {
    'view:introduction': {
      'ui:description': ConflictOfInterestIntro,
    },
    allProprietaryConflictOfInterest: arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {
        title:
          'Do any certifying officials, owners, or officers at your institution receive educational benefits based on enrollment at your school?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        hint: () => null,
        errorMessages: {
          required: 'Please make a selection',
        },
      },
      {
        title:
          'Do you have another individual with a potential conflict of interest to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        errorMessages: {
          required: 'Select yes if you have another individual to add',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:introduction': {
        type: 'object',
        properties: {},
      },
      allProprietaryConflictOfInterest: arrayBuilderYesNoSchema,
    },
    required: ['allProprietaryConflictOfInterest'],
  },
};

export { schoolsSummary as conflictOfInterestSummary };
