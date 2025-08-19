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
    witnessPhone: phoneUI(),
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
