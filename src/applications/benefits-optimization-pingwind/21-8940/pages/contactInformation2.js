import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  inlineTitleUI,
  internationalPhoneSchema,
  internationalPhoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import TelephoneFieldNoInternalErrors from '../components/TelephoneFieldNoInternalErrors';

import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...inlineTitleUI('Contact information', 'How can we reach you?'),
      [veteranFields.homePhone]: {
        ...internationalPhoneUI({
          title: 'Primary phone number',
        }),
        'ui:webComponentField': TelephoneFieldNoInternalErrors,
        'ui:required': () => true,
      },
      [veteranFields.alternatePhone]: {
        ...internationalPhoneUI({
          title: 'Alternate or international phone number (if applicable)',
          hideEmptyValueInReview: true,
        }),
        'ui:webComponentField': TelephoneFieldNoInternalErrors,
      },
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
          [veteranFields.homePhone]: internationalPhoneSchema({
            required: true,
          }),
          [veteranFields.alternatePhone]: internationalPhoneSchema(),
          [veteranFields.email]: emailToSendNotificationsSchema,
        },
      },
    },
  },
};
