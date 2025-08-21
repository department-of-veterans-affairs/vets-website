import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneUI,
  phoneSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    survivingDependentPhone: phoneUI('Phone number'),
    survivingDependentInternationalPhone: internationalPhoneUI(
      'International phone number',
    ),
    survivingDependentEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      survivingDependentPhone: phoneSchema,
      survivingDependentInternationalPhone: internationalPhoneSchema,
      survivingDependentEmail: emailToSendNotificationsSchema,
    },
    required: ['survivingDependentPhone', 'survivingDependentEmail'],
  },
};
