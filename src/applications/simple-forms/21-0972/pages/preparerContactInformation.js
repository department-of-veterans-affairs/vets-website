import {
  emailSchema,
  emailUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerPhone: phoneUI('Phone number'),
    preparerEmail: emailUI('Email address'),
  },
  schema: {
    type: 'object',
    properties: {
      preparerPhone: phoneSchema,
      preparerEmail: emailSchema,
    },
    required: ['preparerPhone'],
  },
};
