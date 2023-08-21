import {
  emailSchema,
  emailUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerHomePhone: phoneUI('Primary phone number'),
    preparerMobilePhone: phoneUI('Secondary phone number'),
    preparerEmail: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      preparerHomePhone: phoneSchema,
      preparerMobilePhone: phoneSchema,
      preparerEmail: emailSchema,
    },
    required: ['preparerHomePhone'],
  },
};
