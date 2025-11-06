import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
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
      [veteranFields.email]: emailToSendNotificationsUI({
        title: 'Email address',
        hint:
          'We’ll use this email address to confirm when we receive your form',
      }),
      electronicCorrespondence: {
        'ui:title':
          'I agree to receive electronic correspondence from the VA about my claim.',
        'ui:webComponentField': VaCheckboxField,
        'ui:options': {
          classNames: 'custom-width',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: [veteranFields.homePhone],
        properties: {
          [veteranFields.homePhone]: internationalPhoneSchema({
            required: true,
          }),
          [veteranFields.email]: emailToSendNotificationsSchema,
          electronicCorrespondence: { type: 'boolean' },
        },
      },
    },
  },
};
