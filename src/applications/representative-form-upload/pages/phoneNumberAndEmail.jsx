import {
  emailSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const phoneNumberAndEmailPage = {
  uiSchema: {
    ...titleUI('Phone and email address'),
    phoneNumber: phoneUI(),
    email: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: phoneSchema,
      email: emailSchema,
    },
    required: ['email'],
  },
};
