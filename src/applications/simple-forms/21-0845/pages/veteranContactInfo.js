import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranPhone: phoneUI(),
    veteranEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranEmail'],
    properties: {
      veteranPhone: phoneSchema,
      veteranEmail: emailToSendNotificationsSchema,
    },
  },
};
