import {
  emailSchema,
  emailUI,
  phoneUI,
  phoneSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    phone: phoneUI('Phone number'),
    internationalPhone: phoneUI('International phone number'),
    email: emailUI('Email address'),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      phone: phoneSchema,
      internationalPhone: phoneSchema,
      email: emailSchema,
    },
    required: ['phone'],
  },
};
