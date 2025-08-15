import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneUI,
  phoneSchema,
  internationalPhoneDeprecatedUI,
  internationalPhoneDeprecatedSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    survivingDependentPhone: phoneUI('Phone number'),
    survivingDependentInternationalPhone: internationalPhoneDeprecatedUI(
      'International phone number',
    ),
    survivingDependentEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      survivingDependentPhone: phoneSchema,
      survivingDependentInternationalPhone: internationalPhoneDeprecatedSchema,
      survivingDependentEmail: emailToSendNotificationsSchema,
    },
    required: ['survivingDependentPhone', 'survivingDependentEmail'],
  },
};
