import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Phone and email address'),
    veteranPhone: phoneUI('Phone number'),
    veteranInternationalPhone: phoneUI('International phone number'),
    veteranEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranPhone: phoneSchema,
      veteranInternationalPhone: phoneSchema,
      veteranEmail: emailToSendNotificationsSchema,
    },
    required: ['veteranPhone', 'veteranEmail'],
  },
};
