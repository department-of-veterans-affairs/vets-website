import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  titleUI,
  phoneUI,
  phoneSchema,
  emailToSendNotificationsUI,
  emailToSendNotificationsSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    [veteranFields.parentObject]: {
      ...titleUI('Phone and email address'),
      [veteranFields.homePhone]: phoneUI('Home phone number'),
      [veteranFields.mobilePhone]: phoneUI('Mobile phone number'),
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
          [veteranFields.mobilePhone]: phoneSchema,
          [veteranFields.email]: emailToSendNotificationsSchema,
        },
      },
    },
  },
};
