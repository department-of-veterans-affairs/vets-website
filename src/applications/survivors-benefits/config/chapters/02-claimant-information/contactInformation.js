import {
  emailSchema,
  emailUI,
  internationalPhoneUI,
  internationalPhoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Email address and phone number'),
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
