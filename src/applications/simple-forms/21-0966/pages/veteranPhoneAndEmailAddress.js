import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneUI,
  internationalPhoneUI,
  phoneSchema,
  internationalPhoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    veteranPhone: phoneUI('Phone number'),
    veteranInternationalPhone: internationalPhoneUI(
      'International phone number',
    ),
    veteranEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranPhone: phoneSchema,
      veteranInternationalPhone: internationalPhoneSchema,
      veteranEmail: emailToSendNotificationsSchema,
    },
    required: ['veteranPhone', 'veteranEmail'],
  },
};
