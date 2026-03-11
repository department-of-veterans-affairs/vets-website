import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  'view:hasSeparationHealthAssessment': yesNoUI(
    'Do you want to upload your Separation Health Assessment Part A?',
  ),
};

export const schema = {
  required: ['view:hasSeparationHealthAssessment'],
  type: 'object',
  properties: {
    'view:hasSeparationHealthAssessment': yesNoSchema,
  },
};
