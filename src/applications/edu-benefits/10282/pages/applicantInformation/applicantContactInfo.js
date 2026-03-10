import {
  emailUI,
  emailSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
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
    mobilePhone: internationalPhoneUI({
      title: 'Mobile phone number',
      hint: null,
    }),
    homePhone: internationalPhoneUI({
      title: 'Home phone number',
      hint: null,
    }),
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
        mobilePhone: internationalPhoneSchema(),
        homePhone: internationalPhoneSchema(),
      },
    },
  },
};
