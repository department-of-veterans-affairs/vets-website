import {
  titleUI,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    homePhone: phoneUI('Home phone number'),
    mobilePhone: phoneUI('Mobile phone number'),
    email: emailUI('Email address'),
  },
  schema: {
    type: 'object',
    properties: {
      homePhone: phoneSchema,
      mobilePhone: phoneSchema,
      email: emailSchema,
    },
    required: ['homePhone', 'email'],
  },
};
