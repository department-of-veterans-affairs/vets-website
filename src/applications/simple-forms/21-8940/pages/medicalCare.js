import {
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { medicalCareFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Recent Medical Care',
    'ui:description': 'Tell us about your recent medical treatment.',
    [medicalCareFields.parentObject]: {
      [medicalCareFields.hasRecentMedicalCare]: yesNoUI({
        title: "Have you been under a doctor's care in the past 12 months?",
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        errorMessages: {
          required:
            'Please select if you have been under medical care in the past 12 months.',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [medicalCareFields.parentObject]: {
        type: 'object',
        required: [medicalCareFields.hasRecentMedicalCare],
        properties: {
          [medicalCareFields.hasRecentMedicalCare]: yesNoSchema,
        },
      },
    },
  },
};
