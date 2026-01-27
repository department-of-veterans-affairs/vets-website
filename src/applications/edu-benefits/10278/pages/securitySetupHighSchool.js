import {
  titleUI,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI("What's the name of the high school you attended?"),
  securityAnswerText: {
    ...textUI({
      title: 'Name of high school',
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
