import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneUI,
  internationalPhoneDeprecatedUI,
  phoneSchema,
  internationalPhoneDeprecatedSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    veteranPhone: phoneUI('Phone number'),
    veteranInternationalPhone: internationalPhoneDeprecatedUI(
      'International phone number',
    ),
    veteranEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranPhone: phoneSchema,
      veteranInternationalPhone: internationalPhoneDeprecatedSchema,
      veteranEmail: emailToSendNotificationsSchema,
    },
    required: ['veteranPhone', 'veteranEmail'],
  },
};
