import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('How long have you known the spouse'),
    howLongKnownSpouse: textUI({
      title: 'How long had/have you known the claimed spouse?',
      hint: 'Months, years',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      howLongKnownSpouse: {
        ...textSchema,
        maxLength: 20,
      },
    },
    required: ['howLongKnownSpouse'],
  },
};
