import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    homePhone: phoneUI('Phone number'),
    emailAddress: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      homePhone: phoneSchema,
      emailAddress: emailToSendNotificationsSchema,
    },
    required: ['homePhone', 'emailAddress'],
  },
};
