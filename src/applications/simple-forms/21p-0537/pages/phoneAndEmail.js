import {
  phoneUI,
  phoneSchema,
  emailToSendNotificationsUI,
  emailToSendNotificationsSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    primaryPhone: phoneUI('Primary phone number'),
    secondaryPhone: phoneUI('Secondary phone number'),
    emailAddress: emailToSendNotificationsUI({
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      primaryPhone: phoneSchema,
      secondaryPhone: phoneSchema,
      emailAddress: {
        ...emailToSendNotificationsSchema,
        maxLength: 30,
      },
    },
    required: ['primaryPhone', 'emailAddress'],
  },
};
