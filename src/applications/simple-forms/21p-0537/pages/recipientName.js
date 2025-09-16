import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Your name'),
    recipientName: textUI({
      title: 'Your full name',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['recipientName'],
    properties: {
      recipientName: textSchema,
    },
  },
};
