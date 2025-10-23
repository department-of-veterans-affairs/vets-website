import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';

const labelText =
  'Is this your first time requesting a Presidential Memorial Certificate?';

/* @type {PageSchema} */
export default {
  uiSchema: {
    isFirstRequest: yesNoUI({
      title: labelText,
      labelHeaderLevel: '3',
      labels: {
        Y:
          'Yes, this is my first time requesting a certificate for this Veteran or Reservist',
        N:
          'No, I either need to replace a Presidential Memorial Certificate or request more copies',
      },
      errorMessages: {
        required:
          'Please answer if this is your first Presidential Memorial Certificate request or not',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['isFirstRequest'],
    properties: {
      isFirstRequest: yesNoSchema,
    },
  },
};
