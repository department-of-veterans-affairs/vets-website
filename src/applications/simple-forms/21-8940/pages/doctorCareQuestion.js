import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { doctorCareQuestionFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [doctorCareQuestionFields.parentObject]: {
      ...titleUI({
        title: 'Your Recent Medical Treatment ',
      }),
      [doctorCareQuestionFields.hasReceivedDoctorCare]: yesNoUI({
        title: "Have you been under a doctor's care for the past 12 months?",
        labels: {
          Y: 'Yes, I confirm',
          N: 'No, I do not confirm',
        },
      }),
      'ui:options': {
        showFieldLabel: true,
        classNames: 'confirmation-required-radio',
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
