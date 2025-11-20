import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('VA benefits'),
    receivedBenefits: yesNoUI({
      title:
        'Was the Veteran receiving VA compensation or pension benefits at the time of their death?',
    }),
  },
  schema: {
    type: 'object',
    required: ['receivedBenefits'],
    properties: {
      receivedBenefits: yesNoSchema,
    },
  },
};
