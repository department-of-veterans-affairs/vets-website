// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Leave of absence'),
    wasOnApprovedLeave: yesNoUI({
      title:
        'Were you on an approved leave of absence when the school was closed/program was suspended or withdrawn?',
      errorMessages: {
        required: 'You must make a selection',
      },
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wasOnApprovedLeave: yesNoSchema,
    },
    required: ['wasOnApprovedLeave'],
  },
};
