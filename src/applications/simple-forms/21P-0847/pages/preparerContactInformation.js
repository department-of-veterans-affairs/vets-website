import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerHomePhone: phoneUI('Primary phone number'),
    preparerMobilePhone: phoneUI('Secondary phone number'),
    preparerEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      preparerHomePhone: phoneSchema,
      preparerMobilePhone: phoneSchema,
      preparerEmail: emailToSendNotificationsSchema,
    },
    required: ['preparerHomePhone', 'preparerEmail'],
  },
};
