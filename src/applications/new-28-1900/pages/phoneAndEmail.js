import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  phoneSchema,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    title: 'Contact information',
    phone: phoneUI('Phone number'),
    cellPhone: phoneUI('Cell phone number'),
    internationalPhone: internationalPhoneUI('International phone number'),
    emailAddress: emailToSendNotificationsUI('Email address'),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      cellPhone: phoneSchema,
      internationalPhone: internationalPhoneSchema,
      emailAddress: emailToSendNotificationsSchema,
    },
    required: ['emailAddress'],
  },
};
