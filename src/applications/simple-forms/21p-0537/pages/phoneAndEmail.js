import {
  titleUI,
  phoneUI,
  phoneSchema,
  emailToSendNotificationsUI,
  emailToSendNotificationsSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('How can we reach you?'),
    primaryPhone: phoneUI('Primary phone number'),
    secondaryPhone: phoneUI('Secondary phone number'),
    emailAddress: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      primaryPhone: phoneSchema,
      secondaryPhone: phoneSchema,
      emailAddress: {
        ...emailToSendNotificationsSchema,
      },
    },
    required: ['primaryPhone', 'emailAddress'],
  },
};
