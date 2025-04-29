import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const pageSchema = {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phone: phoneUI('Phone number'),
    emailAddress: emailToSendNotificationsUI({
      // no living situation risk = has housing = has email
      required: formData => formData.livingSituation?.NONE,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      emailAddress: emailToSendNotificationsSchema,
    },
  },
};

export default pageSchema;
