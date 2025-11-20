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
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      properties: {
        mobilePhone: internationalPhoneSchema(),
        homePhone: internationalPhoneSchema(),
        emailAddress: emailSchema,
      },
    },
  },
};

export { schema, uiSchema };
