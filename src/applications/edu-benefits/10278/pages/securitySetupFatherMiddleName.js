import {
  titleUI,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI("What's your father's middle name?"),
  securityAnswerText: {
    ...textUI({
      title: "Father's middle name",
      hint: 'Maximum limit is 30 characters',
      errorMessages: {
        required: 'You must provide an answer',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    securityAnswerText: {
      type: 'string',
      maxLength: 30,
    },
  },
  required: ['securityAnswerText'],
};

export { schema, uiSchema };
