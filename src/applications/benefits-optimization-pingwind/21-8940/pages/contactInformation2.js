import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  titleUI,
  internationalPhoneSchema,
  internationalPhoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  checkboxSchema,
  checkboxUI,
} from 'platform/forms-system/src/js/web-component-patterns/checkboxPattern';

import TelephoneFieldNoInternalErrors from '../components/TelephoneFieldNoInternalErrors';

import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...titleUI('Contact information', 'How can we reach you?'),
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
      electronicCorrespondence: checkboxUI({
        title:
          'I agree to receive electronic correspondence from the VA about my claim.',
        classNames: 'custom-width',
      }),
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
          [veteranFields.alternatePhone]: internationalPhoneSchema(),
          [veteranFields.email]: emailToSendNotificationsSchema,
          electronicCorrespondence: checkboxSchema,
        },
      },
    },
  },
};
