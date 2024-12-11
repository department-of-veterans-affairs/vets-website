import {
  emailUI,
  emailSchema,
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  contactInfo: {
    ...titleUI('Your contact information'),
    email: emailUI({
      errorMessages: {
        format:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
        pattern:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
      },
    }),
    mobilePhone: phoneUI('Mobile phone number'),
    homePhone: phoneUI('Home phone number'),
  },
};
export const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      required: ['email'],
      properties: {
        email: emailSchema,
        mobilePhone: phoneSchema,
        homePhone: phoneSchema,
      },
    },
  },
};
