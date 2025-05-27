import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
        [veteranFields.parentObject]: {
          [veteranFields.homePhone]: phoneUI('Home phone number'),
          [veteranFields.email]: emailToSendNotificationsUI(),
        },
      }
    : {
        [veteranFields.parentObject]: {
          ...titleUI({
            title: 'Phone and email address',
          }),
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
