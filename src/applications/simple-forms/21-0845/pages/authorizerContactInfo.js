import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerPhone: phoneUI(),
    authorizerEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    required: ['authorizerPhone', 'authorizerEmail'],
    properties: {
      authorizerPhone: phoneSchema,
      authorizerEmail: emailToSendNotificationsSchema,
    },
  },
};
