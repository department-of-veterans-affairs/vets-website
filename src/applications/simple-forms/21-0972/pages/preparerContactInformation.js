import {
  emailSchema,
  emailToSendNotificationsUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerPhone: phoneUI('Phone number'),
    preparerEmail: emailToSendNotificationsUI,
  },
  schema: {
    type: 'object',
    properties: {
      preparerPhone: phoneSchema,
      preparerEmail: emailSchema,
    },
    required: ['preparerPhone', 'preparerEmail'],
  },
};
