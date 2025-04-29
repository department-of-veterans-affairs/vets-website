import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const contactInformationPage = {
  uiSchema: {
    ...titleUI({ title: 'Phone and email address', headerLevel: 1 }),
    phone: phoneUI('Home phone number', { required: true }),
    emailAddress: emailToSendNotificationsUI('Email'),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      emailAddress: emailToSendNotificationsSchema,
    },
    required: ['phone', 'emailAddress'],
  },
};
