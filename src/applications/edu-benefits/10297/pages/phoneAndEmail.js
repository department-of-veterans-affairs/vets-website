import {
  emailSchema,
  emailUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Phone and email address'),
  contactInfo: {
    mobilePhone: internationalPhoneUI('Mobile phone number'),
    homePhone: internationalPhoneUI('Home phone number'),
    emailAddress: emailUI({
      title: 'Email',
      errorMessages: {
        required: 'Please enter an email address',
        pattern:
          'Enter a valid email address using thes format email@domain.com. Your email address can only have letters, numbers, the @ symbbol and a period, with no spaces.',
        format:
          'Enter a valid email address using thes format email@domain.com. Your email address can only have letters, numbers, the @ symbbol and a period, with no spaces.',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      required: ['emailAddress'],
      properties: {
        mobilePhone: internationalPhoneSchema(),
        homePhone: internationalPhoneSchema(),
        emailAddress: { ...emailSchema, pattern: '^[a-zA-Z0-9@.]+$' },
      },
    },
  },
};

export { schema, uiSchema };
