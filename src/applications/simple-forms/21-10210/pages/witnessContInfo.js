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
    ...titleUI('Phone and email address'),
    witnessPhone: phoneUI({
      title: 'Phone number',
      autocomplete: 'tel',
      errorMessages: {
        minLength:
          'Please enter a 10-digit phone number (with or without dashes)',
        pattern:
          'Please enter a 10-digit phone number (with or without dashes)',
        required:
          'Please enter a 10-digit phone number (with or without dashes)',
      },
      inputType: 'tel',
    }),
    witnessEmail: emailToSendNotificationsUI(),
  },
  schema: {
    type: 'object',
    required: ['witnessPhone', 'witnessEmail'],
    properties: {
      witnessPhone: phoneSchema,
      witnessEmail: emailToSendNotificationsSchema,
    },
  },
};
