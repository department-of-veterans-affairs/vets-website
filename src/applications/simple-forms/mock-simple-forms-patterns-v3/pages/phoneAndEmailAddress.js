import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI('Phone and email address'),
    homePhone: phoneUI('Home phone number'),
    mobilePhone: phoneUI('Mobile phone number'),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      homePhone: phoneSchema,
      mobilePhone: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['homePhone'],
  },
};
