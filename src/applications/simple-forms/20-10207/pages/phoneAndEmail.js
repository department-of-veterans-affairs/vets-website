import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['phone'],
  },
};
