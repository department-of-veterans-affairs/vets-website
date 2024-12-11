import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      [veteranFields.homePhone]: phoneUI('Home phone number'),
      [veteranFields.email]: emailToSendNotificationsUI(),
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
