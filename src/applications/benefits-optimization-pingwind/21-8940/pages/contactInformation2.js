import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  inlineTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...inlineTitleUI('Contact information', 'How can we reach you?'),
      [veteranFields.homePhone]: phoneUI('Home phone number'),
      [veteranFields.email]: emailToSendNotificationsUI({
        title: 'Email address',
        hint:
          'We’ll use this email address to confirm when we receive your form',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: [veteranFields.homePhone, veteranFields.email],
        properties: {
          [veteranFields.homePhone]: phoneSchema,
          [veteranFields.email]: emailToSendNotificationsSchema,
        },
      },
    },
  },
};
