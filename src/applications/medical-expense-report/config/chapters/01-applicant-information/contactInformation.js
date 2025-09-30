import {
  emailSchema,
  emailUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// const { internationalPhone } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Your contact information',
  path: 'applicant/contact',
  uiSchema: {
    ...titleUI('Your email address and phone number'),
    email: emailUI('Email'),
    primaryPhone: internationalPhoneUI('Primary phone number'),
  },
  schema: {
    type: 'object',
    required: ['email', 'primaryPhone'],
    properties: {
      email: emailSchema,
      primaryPhone: internationalPhoneSchema(),
    },
  },
};
