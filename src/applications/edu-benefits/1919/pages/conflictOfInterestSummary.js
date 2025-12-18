import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import ConflictOfInterestIntro from './conflictOfInterestIntro';

import { allProprietaryProfitConflictsArrayOptions } from '../helpers';

const schoolsSummary = {
  uiSchema: {
    'view:introduction': {
      'ui:description': ConflictOfInterestIntro,
      'ui:options': {
        hideIf: formData => formData?.allProprietaryProfitConflicts?.length > 0,
      },
    },
    allProprietaryConflictOfInterest: arrayBuilderYesNoUI(
      allProprietaryProfitConflictsArrayOptions,
      {
        title:
          'Do any certifying officials, owners, or officers at your institution receive educational benefits based on enrollment at your school?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        hint: () =>
          "You can add up to 2. If you need to add more, you'll need to submit this form again.",
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
        hint: () =>
          "You can add up to 2. If you need to add more, you'll need to submit this form again.",
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
