import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const veteranContactInformationPage = {
  uiSchema: {
    ...titleUI({
      title: "Veteran's phone number and email address",
      headerLevel: 1,
    }),
    veteranPhone: phoneUI('Phone number', { required: true }),
    veteranEmailAddress: emailToSendNotificationsUI('Email'),
  },
  schema: {
    type: 'object',
    properties: {
      veteranPhone: phoneSchema,
      veteranEmailAddress: emailToSendNotificationsSchema,
    },
    required: ['veteranPhone', 'veteranEmailAddress'],
  },
};
