import {
  emailSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    homePhone: phoneUI('Home phone number'),
    mobilePhone: phoneUI('Mobile phone number'),
    emailAddress: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      homePhone: phoneSchema,
      mobilePhone: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['homePhone', 'emailAddress'],
  },
};
