import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('How long have you known the Veteran'),
    howLongKnownVeteran: textUI({
      title: 'How long had/have you known the Veteran?',
      hint: 'Months, years',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      howLongKnownVeteran: {
        ...textSchema,
        maxLength: 20,
      },
    },
    required: ['howLongKnownVeteran'],
  },
};
