import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Phone and email address'),
  contactInfo: {
    mobilePhone: phoneUI({
      title: 'Mobile phone number',
      hint: 'Include area code',
    }),
    homePhone: phoneUI({
      title: 'Home phone number',
      hint: 'Include area code',
    }),
    emailAddress: emailUI({
      title: 'Email',
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      properties: {
        mobilePhone: phoneSchema,
        homePhone: phoneSchema,
        emailAddress: emailSchema,
      },
    },
  },
};

export { schema, uiSchema };
