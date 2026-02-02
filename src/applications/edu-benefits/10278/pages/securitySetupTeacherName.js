import {
  titleUI,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI("What's the name of your favorite teacher?"),
  securityAnswerText: {
    ...textUI({
      title: 'Name of favorite teacher',
      hint: 'Maximum limit is 30 characters',
      charcount: true,
      errorMessages: {
        required: 'You must provide an answer',
        maxLength: 'You must enter 30 characters or fewer',
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
