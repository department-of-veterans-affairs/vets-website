import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern.jsx';

const labelText =
  'Is this your first time requesting a Presidential Memorial Certificate?';

/* @type {PageSchema} */
export default {
  uiSchema: {
    isFirstRequest: yesNoUI({
      title: labelText,
      labels: {
        Y:
          'Yes, this is my first time requesting a presidential memorial certificate',
        N:
          'No, I either need to replace a presidential memorial certificate or request more copies',
      },
      errorMessages: {
        required:
          'Please select whether this is your first time requesting a certificate',
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
