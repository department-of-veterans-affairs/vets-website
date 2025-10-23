// @ts-check
import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phoneNumber: phoneUI({
      title: 'Phone number',
    }),
    internationalPhoneNumber: internationalPhoneUI({
      title: 'International phone number',
    }),
    emailAddress: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phoneNumber: phoneSchema,
      internationalPhoneNumber: internationalPhoneSchema(),
      emailAddress: emailToSendNotificationsSchema,
    },
    required: ['phoneNumber'],
  },
};
