import {
  emailSchema,
  emailUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your email address and phone number'),
    email: emailUI(),
    primaryPhone: internationalPhoneUI('Primary phone number'),
  },
  schema: {
    type: 'object',
    required: ['email', 'primaryPhone'],
    properties: {
      email: emailSchema,
      primaryPhone: internationalPhoneSchema({ required: true }),
    },
  },
};
