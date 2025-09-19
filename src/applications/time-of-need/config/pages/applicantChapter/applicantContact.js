import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const applicantContact = {
  uiSchema: {
    phoneNumber: textUI({
      title: 'Phone number',
      hint: 'Include area code (numbers only)',
    }),
    emailAddress: textUI({
      title: 'Email address',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: {
        ...textSchema,
        maxLength: 10,
        pattern: '^[0-9]{10}$',
      },
      emailAddress: {
        ...textSchema,
        format: 'email',
        maxLength: 256,
      },
    },
    required: ['phoneNumber', 'emailAddress'],
  },
};

export default applicantContact;
