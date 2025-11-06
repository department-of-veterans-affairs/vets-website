import {
  inlineTitleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { doctorCareQuestionFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [doctorCareQuestionFields.parentObject]: {
      ...inlineTitleUI(
        'Recent Medical Care',
        'Tell us more about the doctors treating you and when.',
      ),
      [doctorCareQuestionFields.hasReceivedDoctorCare]: yesNoUI({
        title: "Have you been under a doctor's care for the past 12 months?",
        labels: {
          Y: "Yes, I have been under a doctor's care in the past 12 months",
          N: "No, I have NOT been under a doctor's care in the past 12 months",
        },
      }),
      'ui:options': {
        showFieldLabel: true,
        classNames: 'confirmation-required-radio',
        hideDuplicateDescription: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [doctorCareQuestionFields.parentObject]: {
        type: 'object',
        required: [doctorCareQuestionFields.hasReceivedDoctorCare],
        properties: {
          [doctorCareQuestionFields.hasReceivedDoctorCare]: yesNoSchema,
        },
      },
    },
  },
};
